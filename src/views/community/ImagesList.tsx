// ** React Imports
import { Fragment, Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import { saveAs } from 'file-saver';

// ** MUI Imports
import Box from '@mui/material/Box'
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
import Container from '@mui/material/Container'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'

import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { formatTimestamp } from 'src/configs/functions'

import { useTranslation } from 'react-i18next'

const ImagesList = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()

  // ** Props
  const {
    imageList,
    favoriteList,
    loading,
    loadingText
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
  const [myFavorite, setMyFavorite] = useState<any>({})
  const [favoriteCounter, setFavoriteCounter] = useState<any>({})

  useEffect(()=>{
    if(imageList) {
      setShowImg(imageList[0])
    }
    setMyFavorite({...favoriteList})
    console.log("favoriteList********", favoriteList) 
    console.log("myFavorite********", myFavorite) 
    const favoriteCounterInitial: any = {}
    imageList.map((item: any)=>{
      favoriteCounterInitial[item.id] = item.favorite
    })
    setFavoriteCounter(favoriteCounterInitial)
  }, [imageList, favoriteList])

  const handleImgInfo = (Index: number) => {
    setShow(true)
    setShowImg(imageList[Index])
    const data = JSON.parse(imageList[Index].data)
    setShowImgData(data)
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

  const handleMyFavorite = async (id: number, status: boolean) => {
    setMyFavorite((myFavorite: any) => {
      const myFavoriteNew = { ...myFavorite };
      myFavoriteNew[id] = status==true?1:-1;

      return myFavoriteNew;
    });
    setFavoriteCounter((favoriteCounter: any) => {
      const favoriteCounterNew = { ...favoriteCounter };
      favoriteCounterNew[id] += status==true?1:-1;

      return favoriteCounterNew;
    });
    if(auth && auth.user)   {
      const PostParams = {id, status: status==true?1:-1}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/user/image/favorite', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit:", FormSubmit)
    }
  };
  
  const renderContent = () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <Card sx={{ px: 3, pt: 1}}>
              {true ? (
                <Fragment>
                  <Grid container spacing={2}>
                    {imageList && imageList.map((item: any, index: number) => (
                      <Grid item key={index} xs={12} sm={6} md={3} lg={3} sx={{mt: 2}}>
                        <Box position="relative">
                          <CardMedia image={`${authConfig.backEndApiChatBook}/api/image/${item.filename}`} sx={{ height: '13.25rem', objectFit: 'contain', borderRadius: 1, cursor: 'pointer' }} onClick={()=>handleImgInfo(index)}/>
                          <Box position="absolute" top={0} left={0} m={1} px={0.8} bgcolor="rgba(0, 0, 0, 0.4)" borderRadius={1} color="white">
                            <Typography variant="body2">Tool</Typography>
                          </Box>
                          <Box
                            position="absolute"
                            bottom={0}
                            left={0}
                            p={1}
                            display="flex"
                            alignItems="center"
                          >
                            <IconButton sx={{ color: 'white' }}>
                              {myFavorite && myFavorite[Number(item.id)] == 1 ?
                              <FavoriteIcon onClick={ ()=>handleMyFavorite(item.id, false) } />
                              :
                              <FavoriteBorderIcon onClick={ ()=>handleMyFavorite(item.id, true) } />
                              }
                            </IconButton>
                            <Typography variant="body2" sx={{ color: 'white', ml: 1 }}>
                              {favoriteCounter[Number(item.id)]}
                            </Typography>
                            <IconButton sx={{ color: 'white', ml: 2 }}>
                              <VisibilityIcon />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: 'white', ml: 1 }}>
                              {item.view}
                            </Typography>
                          </Box>
                        </Box>
                        <CardContent>
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Avatar src={"/images/avatars/1.png"} sx={{ mr: 3, width: 42, height: 42 }} />
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
                                <Typography sx={{ 
                                  fontWeight: 500,
                                  lineHeight: 1.71,
                                  letterSpacing: '0.22px',
                                  fontSize: '0.875rem !important',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap' 
                                  }} >
                                  {item.prompt}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& svg': { mr: 1, color: 'text.secondary', verticalAlign: 'middle' }
                                  }}
                                >
                                  <Icon fontSize='0.875rem' icon='mdi:calendar-blank-outline' />
                                  <Typography variant='caption'>{'@ChatbookAI'}</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
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
                        <CardMedia image={`${authConfig.backEndApiChatBook}/api/image/${showImg?.filename}`} sx={{ width: '700px',height: Math.floor(showImgData.width*700/showImgData.height) + 'px', objectFit: 'contain', borderRadius: 1 }}/>
                        <Button variant='outlined' sx={{ mt: 3, mr: 3 }} size="small" onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/imageorigin/' + showImg?.filename, showImg?.filename + '.png')} >{t('Download') as string}</Button>
                    </Grid>
                    <Grid item xs={4}>
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
            {loading ?
            <Dialog
              open={show}
              onClose={() => setShow(false)}
            >
              <DialogContent sx={{ position: 'relative' }}>
                <Container>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sx={{}}>
                      <Box sx={{ ml: 6, display: 'flex', alignItems: 'center', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                        <CircularProgress sx={{ mb: 4 }} />
                        <Typography>{t(loadingText) as string}</Typography>
                      </Box>
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

export default ImagesList
