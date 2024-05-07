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
    pendingImagesCount
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

  const handleVideoInfo = (Index: number) => {
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
                        {item.status == 0 ?
                        <div style={{ position: 'relative' }}>
                          <CardMedia image={`${authConfig.backEndApiChatBook}/api/videoimage/${item.filename}`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1, cursor: 'pointer' }} onClick={()=>handleVideoInfo(index)}/>
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 3,
                              right: 3,
                              transform: 'rotate(0deg)',
                              transformOrigin: 'bottom right',
                              backgroundColor: 'orange',
                              color: 'white',
                              padding: '0px 4px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              zIndex: 1,
                            }}
                          >
                            Pending
                          </div>
                        </div>
                        :
                        <CardMedia image={`${authConfig.backEndApiChatBook}/api/videoimage/${item.filename}`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1, cursor: 'pointer' }} onClick={()=>handleVideoInfo(index)}/>
                        }
                        
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
                    <Grid item xs={8}>
                        <CardMedia component="video" controls src={`${authConfig.backEndApiChatBook}/api/video/${showImg?.orderId}`} sx={{ width:'500px', height:'500px', borderRadius: 1 }}/>
                        <Button variant='outlined' sx={{ mt: 3, mr: 3 }} size="small" onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/video/' + showImg?.orderId, showImg?.orderId + '.mp4')} >{t('Download') as string}</Button>
                        <Button variant='outlined' sx={{ mt: 3, mr: 3 }} size="small" onClick={()=>handleGenerateSimilar(showImg)}>{t('Generate similar') as string}</Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Grid sx={{ height: '100%', px: 4 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                          {t('Video Information') as string}
                        </Typography>
                        <Grid container spacing={2}>
                          <Divider sx={{ mt: '0 !important' }} />
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>{t('CFG Scale') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.cfg_scale}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>{t('Seed') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImgData.seed}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>{t('Motion') as string}:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {showImg.motion}
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
