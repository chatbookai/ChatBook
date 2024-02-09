// ** MUI Imports
import { Fragment, Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { saveAs } from 'file-saver';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsLine from 'src/views/dashboards/analytics/AnalyticsLine'
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Fade, { FadeProps } from '@mui/material/Fade'

import { formatTimestamp } from 'src/configs/functions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'


const AnalyticsDashboard = () => {
  // ** Hook
  const { t } = useTranslation()

  const [siteInfo, setSiteInfo] = useState<any>()
  const [dataX, setDataX] = useState<string[]>([])
  const [NewFilesPerDay, setNewFilesPerDay] = useState<number[]>([])
  const [NewActivitesPerDay, setNewActivitesPerDay] = useState<number[]>([])
  
  const [NewUserPerDay, setNewUserPerDay] = useState<number[]>([])
  const [NewImagesPerDay, setNewImagesPerDay] = useState<number[]>([])

  const [imageList, setImageList] = useState<any[]>([])

  const [show, setShow] = useState<boolean>(true)
  const [showImg, setShowImg] = useState<any>(null)
  const [showImgData, setShowImgData] = useState<any>(null)

  useEffect(() => {
    axios.get(authConfig.backEndApiChatBook + '/api/static/site', { headers: { }, params: { } })
    .then((res) => {
      setDataX(res.data.DateList)
      setNewUserPerDay(res.data.NewUserPerDay)
      setNewImagesPerDay(res.data.NewImagesPerDay)
      setNewFilesPerDay(res.data.NewFilesPerDay)
      setNewActivitesPerDay(res.data.NewActivitesPerDay)
      setSiteInfo(res.data)
      console.log("NewUserPerDay", NewUserPerDay)
      console.log("NewFilesPerDay", NewFilesPerDay)
    })

    axios.post(authConfig.backEndApiChatBook + '/api/getUserImagesAll/', {pageid: 0, pagesize: 12}, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.data)
    .then((res: any)=>{
      const imageListInitial: string[] = []
      res.data.map((Item: any)=>{
        imageListInitial.push(Item)
      })
      console.log("res", res)
      setImageList(imageListInitial)
    });

  }, [])

  const handleImgInfo = (Index: number) => {
    setShow(true)
    setShowImg(imageList[Index])
    console.log("imageList", imageList)
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

  const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          {siteInfo ?
            <AnalyticsTrophy data={siteInfo}/>
          :
            <Fragment></Fragment>
          }          
        </Grid>
        <Grid item xs={12} md={8}>
          {siteInfo ?
            <AnalyticsTransactionsCard data={siteInfo}/> 
          :
            <Fragment></Fragment>
          }         
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
              <Card sx={{ px: 3, pt: 1}}>
                {true ? (
                  <Fragment>
                    <Grid container spacing={2}>
                      {imageList && imageList.map((item: any, index: number) => (
                        <Grid item key={index} xs={12} sm={6} md={3} lg={3} sx={{pl: 2, mt: 4}}>
                          <CardMedia image={`${authConfig.backEndApiChatBook}/api/image/${item.filename}`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1, cursor: 'pointer' }} onClick={()=>handleImgInfo(index)}/>
                        </Grid>
                      ))}
                    </Grid>
                  </Fragment>
                ) : (
                  <Fragment></Fragment>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={NewImagesPerDay} title={`${t(`New images per day`)}`} bottomText={""}/>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={NewActivitesPerDay} title={`${t(`New activites per day`)}`} bottomText={""}/>
        </Grid>

        
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

      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
