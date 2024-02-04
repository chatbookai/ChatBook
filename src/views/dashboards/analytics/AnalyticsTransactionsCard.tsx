// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const renderStats = (data: any) => {
  const salesData: DataType[] = [
    {
      stats: String(data.TotalImages),
      title: 'Images',
      color: 'primary',
      icon: <Icon icon='mdi:trending-up' />
    },
    {
      stats: String(data.TotalActivites),
      title: 'Activites',
      color: 'success',
      icon: <Icon icon='mdi:account-outline' />
    },
    {
      stats: String(data.TotalUsers),
      title: 'Users',
      color: 'warning',
      icon: <Icon icon='mdi:cellphone-link' />
    },
    {
      stats: String(data.TotalFiles),
      title: 'Files',
      color: 'info',
      icon: <Icon icon='mdi:currency-usd' />
    }
  ]
  
  return salesData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          variant='rounded'
          color={item.color}
          sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
        >
          {item.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

export type propsType = {
  data: any
}

const AnalyticsTransactionsCard = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props

  return (
    <Card>
      <CardHeader
        title={`${t(`Site Info`)}`}
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: (theme: any) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsTransactionsCard
