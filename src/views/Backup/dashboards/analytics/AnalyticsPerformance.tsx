// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const series = [
  {
    name: 'Income',
    data: [70, 90, 90, 90, 80, 90]
  },
  {
    name: 'Net Worth',
    data: [120, 80, 100, 80, 100, 80]
  }
]

const CardWidgetsPerformance = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: [theme.palette.primary.main, theme.palette.info.main],
    plotOptions: {
      radar: {
        size: 110,
        polygons: {
          connectorColors: theme.palette.divider,
          strokeColors: [
            theme.palette.divider,
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            'transparent'
          ]
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [theme.palette.primary.main, theme.palette.info.main],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    markers: { size: 0 },
    legend: {
      labels: { colors: theme.palette.text.secondary }
    },
    grid: { show: false },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: '14px',
          colors: [
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled,
            theme.palette.text.disabled
          ]
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardHeader
        title='Performance'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.primary' } }}
          />
        }
      />
      <CardContent>
        <ReactApexcharts type='radar' height={305} series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default CardWidgetsPerformance
