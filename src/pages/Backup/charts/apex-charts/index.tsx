// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import ApexBarChart from 'src/views/charts/apex-charts/ApexBarChart'
import ApexAreaChart from 'src/views/charts/apex-charts/ApexAreaChart'
import ApexLineChart from 'src/views/charts/apex-charts/ApexLineChart'
import ApexRadarChart from 'src/views/charts/apex-charts/ApexRadarChart'
import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'
import ApexColumnChart from 'src/views/charts/apex-charts/ApexColumnChart'
import ApexScatterChart from 'src/views/charts/apex-charts/ApexScatterChart'
import ApexHeatmapChart from 'src/views/charts/apex-charts/ApexHeatmapChart'
import ApexRadialBarChart from 'src/views/charts/apex-charts/ApexRadialBarChart'
import ApexCandlestickChart from 'src/views/charts/apex-charts/ApexCandlestickChart'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ApexCharts = () => {
  return (
    <ApexChartWrapper>
      <DatePickerWrapper>
        <Grid container spacing={6} className='match-height'>
          <PageHeader
            title={
              <Typography variant='h5'>
                <LinkStyled href='https://github.com/apexcharts/react-apexcharts' target='_blank'>
                  React ApexCharts
                </LinkStyled>
              </Typography>
            }
            subtitle={<Typography variant='body2'>React Component for ApexCharts</Typography>}
          />
          <Grid item xs={12}>
            <ApexAreaChart />
          </Grid>
          <Grid item xs={12}>
            <ApexColumnChart />
          </Grid>
          <Grid item xs={12}>
            <ApexScatterChart />
          </Grid>
          <Grid item xs={12}>
            <ApexLineChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexBarChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexCandlestickChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexHeatmapChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexRadialBarChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexRadarChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexDonutChart />
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </ApexChartWrapper>
  )
}

export default ApexCharts
