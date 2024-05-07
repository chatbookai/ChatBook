// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Fragment } from 'react'

export type propsType = {
  dataX: string[]
  dataY: number[]
  title: string
  bottomText: string
}



const AnalyticsLine = (props: propsType) => {
  // ** Props
  const { dataX, dataY, title, bottomText } = props

  const series = [{ data: dataY }]

  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: true },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: true }
      },
      padding: {
        top: -10,
        left: -7,
        right: 5,
        bottom: 5
      }
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight'
    },
    colors: [theme.palette.primary.main],
    markers: {
      size: 6,
      offsetY: 4,
      offsetX: -2,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 5.5,
          seriesIndex: 0,
          strokeColor: theme.palette.primary.main,
          fillColor: theme.palette.background.paper,
          dataPointIndex: series[0].data.length - 1
        }
      ],
      hover: { size: 7 }
    },
    xaxis: {
      axisBorder: { show: true },      
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
      categories: dataX      
    },
    yaxis: {
      labels: { show: true }
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>{title}</Typography>
        <ReactApexcharts type='line' height={220} options={options} series={series} />
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

export default AnalyticsLine
