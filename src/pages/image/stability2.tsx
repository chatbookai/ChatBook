// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import GetImgLeft2 from 'src/views/image/stability/GetImgLeft2'
import GetImgContent from 'src/views/image/stability/GetImgContent'

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
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getUserImagesStabilityAi/', {pageid: 0, pagesize: 30}, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const imageListInitial: string[] = []
        RS.data.map((Item: any)=>{
          imageListInitial.push(Item)
        })
        setImageList(imageListInitial.filter((element) => element != null))
      }
      if(RS && RS.status && RS.status=='error' && RS.msg=='Token is invalid') {
        CheckPermission(auth, router, true)
      }
    }
  }

  const handleGenerateImage = async (data: any, numberOfImages: number) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonText(t("Generating images...") as string)
      setPendingImagesCount(numberOfImages)
      console.log("numberOfImages", numberOfImages)
      try {
        const ImageListData = await Promise.all(
          Array.from({ length: numberOfImages }, async () => {
            const generateImageInfo = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageFromImageStabilityAi/', data, {
              headers: { Authorization: auth?.user?.token, 'Content-Type': 'multipart/form-data' },
            }).then(res => res.data);
            if(generateImageInfo && generateImageInfo.status == 'error') {
              toast.error(t(generateImageInfo.msg), {
                duration: 4000
              })
              if(generateImageInfo && generateImageInfo.msg=='Token is invalid') {
                CheckPermission(auth, router, true)
              }
            }
            console.log("generateImageInfo", generateImageInfo);

            return generateImageInfo;
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
    else {
      toast.error(t("Please login first"), {
        duration: 4000
      })
      router.push('/login')
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
    const generateImageInfo = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageUpscaleStabilityAi/', data, {
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
      <GetImgLeft2
        handleGenerateImage={handleGenerateImage}
        handleSubmitText={handleSubmitText}
        sendButtonDisable={sendButtonDisable}
        sendButtonText={sendButtonText}
        generateSimilarData={generateSimilarData}
        setSendButtonDisable={setSendButtonDisable}
      />
      <GetImgContent
        imageList={imageList}
        pendingImagesCount={pendingImagesCount}
        handleGenerateSimilarGetImg={handleGenerateSimilarGetImg}
        handleUpscaleStabilityAi={handleUpscaleStabilityAi}
      />
      </Box>
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
