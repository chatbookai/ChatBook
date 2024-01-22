// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#32baff',
  series5: '#ffa1a1'
}

const ApexDonutChart = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: ['Operational', 'Networking', 'Hiring', 'R&D'],
    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: (val: string) => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: 'Operational',
              formatter: () => '31%',
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Expense Ratio'
        subheader='Spending on various categories'
        subheaderTypographyProps={{ sx: { color: (theme: any) => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <ReactApexcharts type='donut' height={400} options={options} series={[85, 16, 50, 50]} />
      </CardContent>
    </Card>
  )
}

export default ApexDonutChart
