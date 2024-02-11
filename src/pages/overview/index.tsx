// ** MUI Imports
import { Fragment, useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import axios from 'axios'
import authConfig from 'src/configs/auth'

import CommunityModel from 'src/views/community/community';

const AnalyticsDashboard = () => {
  // ** Hook

  const [siteInfo, setSiteInfo] = useState<any>()

  useEffect(() => {
    axios.get(authConfig.backEndApiChatBook + '/api/static/site', { headers: { }, params: { } })
    .then((res) => {
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
        
        <Grid item xs={12} md={12}>
          <CommunityModel />
        </Grid>

      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
