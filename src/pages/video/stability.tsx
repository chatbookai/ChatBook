// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import VideoLeft from 'src/views/video/stability/VideoLeft'
import VideoContent from 'src/views/video/stability/VideoContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { ChatChatNameList, CheckPermission  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])
  
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)

  // ** States
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Generate images") as string)
  }, [])


  const [pendingImagesCount, setPendingImagesCount] = useState<number>(0)
  const [imageList, setImageList] = useState<any[]>([])

  useEffect(() => {
    getImagesList()
  }, [refreshChatCounter])

  const getImagesList = async function () {
    if(auth.user && auth.user.token)  {
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getUserVideosStabilityAi/', {pageid: 0, pagesize: 30}, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const imageListInitial: string[] = []
        RS.data.map((Item: any)=>{
          imageListInitial.push(Item)
        })
        setImageList(imageListInitial.filter((element) => element != null))
      }
    }
  }

  const handleGenerateVideo = async (data: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonText(t("Generating video...") as string)
      try {
        const GenerateStatus = await axios.post(authConfig.backEndApiChatBook + '/api/generateVideoStabilityAi/', data, {
                                    headers: { Authorization: auth?.user?.token, 'Content-Type': 'multipart/form-data' },
                                }).then(res => res.data);
        console.log("GenerateStatus:", GenerateStatus);
        if(GenerateStatus && GenerateStatus.status == 'ok') {
          setSendButtonDisable(false)
          setRefreshChatCounter(refreshChatCounter + 2)
          setSendButtonText(t("Generate video") as string)
          setPendingImagesCount(0)
          toast.success(t(GenerateStatus.msg), {
            duration: 4000
          })
        }
        if(GenerateStatus && GenerateStatus.status == 'error') {
            setSendButtonDisable(false)
            setRefreshChatCounter(refreshChatCounter + 2)
            setSendButtonText(t("Generate video") as string)
            setPendingImagesCount(0)
            toast.error(t(GenerateStatus.msg), {
              duration: 4000
            })
            CheckPermission(auth, router, true)
        }
      } 
      catch (error) {
        setSendButtonDisable(false)
        setSendButtonText(t("Generate video") as string)
        setPendingImagesCount(0)
        console.log("handleGenerateVideo Error fetching video:", error);
      }
    }
  }

  const handleSubmitText = (Text: string) => {
    setSendButtonText(t(Text) as string)
  }

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <VideoLeft
        handleGenerateVideo={handleGenerateVideo}
        handleSubmitText={handleSubmitText}
        sendButtonDisable={sendButtonDisable}
        setSendButtonDisable={setSendButtonDisable}
        sendButtonText={sendButtonText}
      />
      <VideoContent
        imageList={imageList}
        pendingImagesCount={pendingImagesCount}
      />
      </Box>
      :
      null
      }
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
