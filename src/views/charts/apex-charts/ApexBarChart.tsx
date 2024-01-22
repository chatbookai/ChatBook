// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import format from 'date-fns/format'
import { ApexOptions } from 'apexcharts'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

interface PickerProps {
  start: Date | number
  end: Date | number
}

const ApexBarChart = () => {
  // ** States
  const [endDate, setEndDate] = useState<DateType>(null)
  const [startDate, setStartDate] = useState<DateType>(null)

  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: ['#00cfe8'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories: ['MON, 11', 'THU, 14', 'FRI, 15', 'MON, 18', 'WED, 20', 'FRI, 21', 'MON, 23'],
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    }
  }

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:bell-outline' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon icon='mdi:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <Card>
      <CardHeader
        title='Data Science'
        subheader='$74,382.72'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <DatePicker
            selectsRange
            endDate={endDate}
            id='apexchart-bar'
            selected={startDate}
            startDate={startDate}
            onChange={handleOnChange}
            placeholderText='Click to select a date'
            customInput={<CustomInput start={startDate as Date | number} end={endDate as Date | number} />}
          />
        }
      />
      <CardContent>
        <ReactApexcharts
          type='bar'
          height={400}
          options={options}
          series={[{ data: [700, 350, 480, 600, 210, 550, 150] }]}
        />
      </CardContent>
    </Card>
  )
}

export default ApexBarChart
