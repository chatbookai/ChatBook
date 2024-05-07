// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** React Imports
import { Fragment } from 'react'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

export type propsType = {
  dataX: string[]
  dataY: number[]
  title: string
  bottomText:string
}

const AnalyticsBar = (props: propsType) => {
  // ** Props
  const { dataX, dataY, title, bottomText } = props

  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      borderColor: theme.palette.divider,
      padding: {
        top: -1,
        left: -9,
        right: 0,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.customColors.trackBg,
      theme.palette.customColors.trackBg,
      theme.palette.customColors.trackBg,
      theme.palette.primary.main,
      theme.palette.customColors.trackBg,
      theme.palette.customColors.trackBg
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: dataX,
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: true },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetY: 2,
        offsetX: -17,
        style: { colors: theme.palette.text.disabled },
        formatter: value => `${value}Gb`
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='bar' height={200} options={options} series={[{ data: dataY }]} />
        {bottomText && bottomText!="" ?
          <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
            {bottomText}
          </Typography>
        :
          <Fragment></Fragment>
        }
      </CardContent>
    </Card>
  )
}

export default AnalyticsBar
