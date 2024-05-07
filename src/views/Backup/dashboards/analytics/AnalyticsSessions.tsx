// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const series = [
  {
    name: '2022',
    data: [45, 85, 65, 50, 70]
  }
]

const CardStatsDistributedColumnChart = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      x: { show: false }
    },
    grid: {
      show: false,
      padding: {
        top: -10,
        left: -7,
        right: 0,
        bottom: 5
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.error.main,
      theme.palette.primary.main,
      theme.palette.error.main,
      theme.palette.primary.main,
      theme.palette.primary.main
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%',
        borderRadius: 4,
        distributed: true,
        colors: {
          backgroundBarRadius: 5,
          backgroundBarColors: [
            theme.palette.customColors.trackBg,
            theme.palette.customColors.trackBg,
            theme.palette.customColors.trackBg,
            theme.palette.customColors.trackBg,
            theme.palette.customColors.trackBg
          ]
        }
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>2,856</Typography>
        <ReactApexcharts type='bar' height={98} options={options} series={series} />
        <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
          Sessions
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardStatsDistributedColumnChart
