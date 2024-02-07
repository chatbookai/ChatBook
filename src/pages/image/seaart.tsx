// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import GetImgLeft from 'src/views/image/seaart/GetImgLeft'
import GetImgContent from 'src/views/image/seaart/GetImgContent'

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
    CheckPermission(auth, router)
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
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getUserImagesSeaArt/', {pageid: 0, pagesize: 30}, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const imageListInitial: string[] = []
        RS.data.map((Item: any)=>{
          imageListInitial.push(Item)
        })
        setImageList([...imageListInitial, ...imageList].filter((element) => element != null))
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
            const ImageName = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageSeaArt/', data, {
              headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
            }).then(res => res.data);
            console.log("ImageName", ImageName);

            return ImageName;
          })
        );
        console.log("ImageListData:", ImageListData);
        if(ImageListData && ImageListData.length > 0 && ImageListData[0]!=null) {
          setSendButtonDisable(false)
          setRefreshChatCounter(refreshChatCounter + 2)
          setSendButtonText(t("Generate images") as string)
          setImageList([...ImageListData, ...imageList].filter((element) => element != null))
          console.log("imageListimageListimageListimageListimageList:", imageList)
          setPendingImagesCount(0)
        }
        if(ImageListData && ImageListData.length > 0 && ImageListData[0]==null) {
          setSendButtonDisable(false)
          setSendButtonText(t("Generate images") as string)
          setPendingImagesCount(0)
          toast.error(t('Failed to generate the image, please modify your input parameters and try again'), {
            duration: 4000
          })
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
