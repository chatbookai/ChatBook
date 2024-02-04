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

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

interface ChainInfoType {
  network: string
  version: number
  release: number
  height: number
  current: string
  blocks: number
  peers: number
  time: number
  miningtime: number
  weave_size: number
  denomination: number
  diff: string
}

const AnalyticsDashboard = () => {
  // ** Hook
  const { t } = useTranslation()

  const [siteInfo, setSiteInfo] = useState<any>()
  const [dataX, setDataX] = useState<string[]>([])
  const [NewFilesPerDay, setNewFilesPerDay] = useState<number[]>([])
  const [NewActivitesPerDay, setNewActivitesPerDay] = useState<number[]>([])
  
  const [NewUserPerDay, setNewUserPerDay] = useState<number[]>([])
  const [NewImagesPerDay, setNewImagesPerDay] = useState<number[]>([])

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
