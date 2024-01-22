// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const radialBarColors = {
  series1: '#fdd835',
  series2: '#32baff',
  series3: '#00d4bd',
  series4: '#7367f0',
  series5: '#FFA1A1'
}

const ApexRadialBarChart = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    stroke: { lineCap: 'round' },
    labels: ['Comments', 'Replies', 'Shares'],
    legend: {
      show: true,
      position: 'bottom',
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
    colors: [radialBarColors.series1, radialBarColors.series2, radialBarColors.series4],
    plotOptions: {
      radialBar: {
        hollow: { size: '30%' },
        track: {
          margin: 15,
          background: hexToRGBA(theme.palette.customColors.trackBg, 1)
        },
        dataLabels: {
          name: {
            fontSize: '2rem'
          },
          value: {
            fontSize: '1rem',
            color: theme.palette.text.secondary
          },
          total: {
            show: true,
            fontWeight: 400,
            label: 'Comments',
            fontSize: '1.125rem',
            color: theme.palette.text.primary,
            formatter: function (w) {
              const totalValue =
                w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0) / w.globals.series.length

              if (totalValue % 1 === 0) {
                return totalValue + '%'
              } else {
                return totalValue.toFixed(2) + '%'
              }
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Statistics' />
      <CardContent>
        <ReactApexcharts type='radialBar' height={400} options={options} series={[80, 50, 35]} />
      </CardContent>
    </Card>
  )
}

export default ApexRadialBarChart
