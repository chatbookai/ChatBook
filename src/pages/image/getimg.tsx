// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import GetImgLeft from 'src/views/image/GetImg/GetImgLeft'
import GetImgContent from 'src/views/image/GetImg/GetImgContent'

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
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getUserImagesGetImg/', {pageid: 0, pagesize: 30}, {
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

  const handleGenerateImage = async (data: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonText(t("Generating images...") as string)
      setPendingImagesCount(data.numberOfImages)
      const numberOfImages = data.numberOfImages
      try {
        const ImageListData = await Promise.all(
          Array.from({ length: numberOfImages }, async () => {
            const generateImageInfo = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageGetImg/', data, {
              headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
            }).then(res => res.data);
            console.log("generateImageInfo", generateImageInfo);
            if(generateImageInfo && generateImageInfo.status == 'error') {
              toast.error(t(generateImageInfo.msg), {
                duration: 4000
              })
              CheckPermission(auth, router, true)
            }
            
            return generateImageInfo;
          })
        );
        console.log("ImageListData:", ImageListData);
        if(ImageListData && ImageListData.length > 0 && ImageListData[0].status == 'ok') {
          setSendButtonDisable(false)
          setRefreshChatCounter(refreshChatCounter + 2)
          setSendButtonText(t("Generate images") as string)
          setImageList(ImageListData.filter((element) => element != null))
          console.log("imageListimageListimageListimageListimageList:", imageList)
          setPendingImagesCount(0)
        }
        if(ImageListData && ImageListData.length > 0 && ImageListData[0].status == 'error') {
          setSendButtonDisable(false)
          setRefreshChatCounter(refreshChatCounter + 2)
          setSendButtonText(t("Generate images") as string)
          setImageList(ImageListData.filter((element) => element != null))
          console.log("imageListimageListimageListimageListimageList:", imageList)
          setPendingImagesCount(0)
        }
      } 
      catch (error) {
        setSendButtonDisable(false)
        setSendButtonText(t("Generate images") as string)
        setPendingImagesCount(0)
        console.log("handleGenerateImage Error fetching images:", error);
      }
    }
  }

  const handleSubmitText = (Text: string) => {
    setSendButtonText(t(Text) as string)
  }

  const [generateSimilarData, setGenerateSimilarData] = useState<any>(null)
  const handleGenerateSimilarGetImg = (showImg: any) => {
    setGenerateSimilarData(showImg)
  }

  const handleUpscaleStabilityAi = async (showImg: any) => {
    const data = { filename: showImg.filename }
    setPendingImagesCount(1)
    const generateImageInfo = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageUpscaleGetImg/', data, {
      headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
    }).then(res => res.data);
    console.log("generateImageInfo", generateImageInfo);
    if(generateImageInfo && generateImageInfo.status == 'error') {
      toast.error(t(generateImageInfo.msg), {
        duration: 4000
      })
    }
    if(generateImageInfo && generateImageInfo.status == 'ok') {
      toast.success(t(generateImageInfo.msg), {
        duration: 4000
      })
    }
    setPendingImagesCount(0)
    setRefreshChatCounter(refreshChatCounter + 2)
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
      <GetImgLeft
        handleGenerateImage={handleGenerateImage}
        handleSubmitText={handleSubmitText}
        sendButtonDisable={sendButtonDisable}
        sendButtonText={sendButtonText}
        generateSimilarData={generateSimilarData}
      />
      <GetImgContent
        imageList={imageList}
        pendingImagesCount={pendingImagesCount}
        handleGenerateSimilarGetImg={handleGenerateSimilarGetImg}
        handleUpscaleStabilityAi={handleUpscaleStabilityAi}
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
