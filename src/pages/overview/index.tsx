// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsLine from 'src/views/dashboards/analytics/AnalyticsLine'
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import TransitionPage from 'src/views/chat/GetImg/TransitionPage'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

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

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/api/static/site', { headers: { }, params: { } })
    .then((res) => {
      setDataX(res.data.DateList)
      setNewUserPerDay(res.data.NewUserPerDay)
      setNewImagesPerDay(res.data.NewImagesPerDay)
      setNewFilesPerDay(res.data.NewFilesPerDay)
      setNewActivitesPerDay(res.data.NewActivitesPerDay)
      setSiteInfo(res.data)
    })

    axios.post(authConfig.backEndApi + '/api/getUserImagesAll/', {pageid: 0, pagesize: 12}, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.data)
    .then((res: any)=>{
      const imageListInitial: string[] = []
      res.data.map((Item: any)=>{
        imageListInitial.push(Item.filename)
      })
      console.log("res", res)
      setImageList(imageListInitial)
    });

  }, [])

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
                          <CardMedia image={`${authConfig.backEndApi}/api/image/${item}`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1 }}/>
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
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={NewFilesPerDay} title={`${t(`New files per day`)}`} bottomText={""}/>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={NewUserPerDay} title={`${t(`New users per day`)}`} bottomText={""}/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
