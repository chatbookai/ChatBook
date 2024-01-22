// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const scatterColors = {
  series1: '#ff9f43',
  series2: '#7367f0',
  series3: '#28c76f'
}

const series = [
  {
    name: 'Angular',
    data: [
      { x: 5.4, y: 170 },
      { x: 5.4, y: 100 },
      { x: 6.3, y: 170 },
      { x: 5.7, y: 140 },
      { x: 5.9, y: 130 },
      { x: 7.0, y: 150 },
      { x: 8.0, y: 120 },
      { x: 9.0, y: 170 },
      { x: 10.0, y: 190 },
      { x: 11.0, y: 220 },
      { x: 12.0, y: 170 },
      { x: 13.0, y: 230 }
    ]
  },
  {
    name: 'Vue',
    data: [
      { x: 14.0, y: 220 },
      { x: 15.0, y: 280 },
      { x: 16.0, y: 230 },
      { x: 18.0, y: 320 },
      { x: 17.5, y: 280 },
      { x: 19.0, y: 250 },
      { x: 20.0, y: 350 },
      { x: 20.5, y: 320 },
      { x: 20.0, y: 320 },
      { x: 19.0, y: 280 },
      { x: 17.0, y: 280 },
      { x: 22.0, y: 300 },
      { x: 18.0, y: 120 }
    ]
  },
  {
    name: 'React',
    data: [
      { x: 14.0, y: 290 },
      { x: 13.0, y: 190 },
      { x: 20.0, y: 220 },
      { x: 21.0, y: 350 },
      { x: 21.5, y: 290 },
      { x: 22.0, y: 220 },
      { x: 23.0, y: 140 },
      { x: 19.0, y: 400 },
      { x: 20.0, y: 200 },
      { x: 22.0, y: 90 },
      { x: 20.0, y: 120 }
    ]
  }
]

const ApexScatterChart = () => {
  // ** State
  const [active, setActive] = useState<string | null>('daily')

  // ** Hook
  const theme = useTheme()

  const handleActive = (event: MouseEvent<HTMLElement>, newActive: string | null) => {
    setActive(newActive)
  }

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: {
        type: 'xy',
        enabled: true
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    colors: [scatterColors.series1, scatterColors.series2, scatterColors.series3],
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      tickAmount: 10,
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled },
        formatter: (val: string) => parseFloat(val).toFixed(1)
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='New Technologies Data'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <ToggleButtonGroup exclusive value={active} onChange={handleActive}>
            <ToggleButton value='daily'>Daily</ToggleButton>
            <ToggleButton value='monthly'>Monthly</ToggleButton>
            <ToggleButton value='yearly'>Yearly</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <ReactApexcharts type='scatter' height={400} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default ApexScatterChart
