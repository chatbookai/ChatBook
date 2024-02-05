// ** React Imports
import { Fragment, Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import { saveAs } from 'file-saver';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import authConfig from 'src/configs/auth'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { formatTimestamp } from 'src/configs/functions'

import TransitionPage from './TransitionPage'
import { useTranslation } from 'react-i18next'

const ChatContent = (props: any) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    imageList,
    pendingImagesCount,
    handleGenerateSimilarGetImg
  } = props

  const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })

  const [show, setShow] = useState<boolean>(true)
  const [showImg, setShowImg] = useState<any>(null)
  const [showImgData, setShowImgData] = useState<any>(null)

  useEffect(()=>{
    if(imageList) {
      setShowImg(imageList[0])
    }
  }, [])

  const handleImgInfo = (Index: number) => {
    setShow(true)
    setShowImg(imageList[Index])
    const data = JSON.parse(imageList[Index].data)
    setShowImgData(data)
    console.log("showImg", showImg)
    console.log("showImgData", showImgData)
  }

  const handleDownload = (DownloadUrl: string, FileName: string) => {
    fetch(DownloadUrl)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, FileName);
      })
      .catch(error => {
        console.log('Error downloading file:', error);
      });
  };

  const handleGenerateSimilar = (showImg: any) => {
    handleGenerateSimilarGetImg(showImg)
    setShow(false)
    console.log('handleGenerateSimilar showImg:', showImg);
  };

  const renderContent = () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <Card sx={{ px: 3, pt: 1}}>
              {true ? (
                <Fragment>
                  <Grid container spacing={2}>
                    {Array.from({ length: pendingImagesCount }, (_, index) => index + 1).map((Index: number)=>{
                      return (
                        <Grid item key={Index} xs={12} sm={6} md={3} lg={3} sx={{mt: 2}}>
                          <TransitionPage />
                        </Grid>
                        )
                    })}
                    {imageList && imageList.map((item: any, index: number) => (
                      <Grid item key={index} xs={12} sm={6} md={3} lg={3} sx={{mt: 2}}>
                        <CardMedia image={`${authConfig.backEndApiChatBook}/api/image/${item.filename}`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1, cursor: 'pointer' }} onClick={()=>handleImgInfo(index)}/>
                      </Grid>
                    ))}
                  </Grid>
                </Fragment>
              ) : (
                <Fragment></Fragment>
              )}
            </Card>
            {showImg && show && showImgData ?
            <Dialog
              fullWidth
              open={show}
              scroll='body'
              maxWidth='lg'
              onClose={() => setShow(false)}
              TransitionComponent={Transition}
              onBackdropClick={() => setShow(false)}
            >
              <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <IconButton
                  size='small'
                  onClick={() => setShow(false)}
                  sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                >
                  <Icon icon='mdi:close' />
                </IconButton>                
                <Container>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <CardMedia image={`${authConfig.backEndApiChatBook}/api/image/${showImg?.filename}`} sx={{ height: '500px', objectFit: 'cover', borderRadius: 1 }}/>
                        <Button variant='outlined' sx={{ mt: 3, mr: 3 }} size="small" onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/imageorigin/' + showImg?.filename, showImg?.filename + '.png')} >{t('Download') as string}</Button>
                        <Button variant='outlined' sx={{ mt: 3, mr: 3 }} size="small" onClick={()=>handleGenerateSimilar(showImg)}>{t('Generate similar') as string}</Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid sx={{ height: '100%', px: 4 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                          {t('Image Information') as string}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>{t('Prompt') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImg.prompt}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>{t('Negative Prompt') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImg.negative_prompt || '　'}
                            </Typography>
                          </Grid>
                          <Divider sx={{ mt: '0 !important' }} />
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>{t('Size') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.width} * {showImgData.height}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>{t('CFG Scale') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.cfg_scale}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>{t('Steps') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.steps}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>{t('Seed') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.seed}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>{t('Style Preset') as string}: </strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.style_preset}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              <strong>{t('AI Model') as string}: </strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImg.model}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>{t('Created') as string}: </strong>
                            </Typography>
                            <Typography variant="body1">
                              {formatTimestamp(showImg.createtime)}
                            </Typography>
                          </Grid>
                          
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
              </DialogContent>
            </Dialog>
            :
            null}
          </Grid>
        </Grid>
      )
  }

  return renderContent()
}

export default ChatContent
