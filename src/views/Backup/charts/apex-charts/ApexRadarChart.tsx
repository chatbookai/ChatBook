// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const radarColors = {
  series1: '#9b88fa',
  series2: '#ffa1a1'
}

const series = [
  {
    name: 'iPhone 12',
    data: [41, 64, 81, 60, 42, 42, 33, 23]
  },
  {
    name: 'Samsung s20',
    data: [65, 46, 42, 25, 58, 63, 76, 43]
  }
]

const ApexRadarChart = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 1,
        blur: 8,
        left: 1,
        opacity: 0.2,
        enabled: false
      }
    },
    markers: { size: 0 },
    fill: { opacity: [1, 0.8] },
    colors: [radarColors.series1, radarColors.series2],
    stroke: {
      width: 0,
      show: false
    },
    legend: {
      labels: {
        colors: theme.palette.text.secondary
      },
      markers: {
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider
        }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        bottom: -20
      }
    },
    yaxis: { show: false },
    xaxis: {
      categories: ['Battery', 'Brand', 'Camera', 'Memory', 'Storage', 'Display', 'OS', 'Price'],
      labels: {
        style: {
          colors: [
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled
          ]
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Mobile Comparison' />
      <CardContent>
        <ReactApexcharts type='radar' height={400} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default ApexRadarChart
