// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'

import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
;<link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap' rel='stylesheet' />

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const WhyWithUsCard = () => {
  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={7}></Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{ pt: ['0 !important', '1.5rem !important'], pl: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent sx={{ p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important` }}>
            <Typography
              variant='h4'
              sx={{ mb: 3.5, fontFamily: 'Cormorant Garamond', fontWeight: '700', textAlign: 'center' }}
            >
              Why Chatbook AI?
            </Typography>
            <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
              click to know more
            </Typography>
            <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon icon='mdi:cog-outline' fontSize={20} />

              <Icon icon='mdi:language-javascript' fontSize={20} />
              <Icon icon='uis:airplay' />
              <Icon icon='gala:secure' color='#336c34' fontSize={80} />
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default WhyWithUsCard
