// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
;<link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap' rel='stylesheet' />

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const CardIntro = () => {
  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={5}>
          <CardContent sx={{ p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important` }}>
            <Typography variant='h4' sx={{ mb: 3.5, fontFamily: 'Cormorant Garamond', fontWeight: '700' }}>
              Discover the Future of Realestate AI Technology
            </Typography>
            <Typography variant='subtitle1'>
              Chatbook AI leverages cutting-edge AI to weave your home search and design aspirations into vivid,
              narrative-rich visuals, merging simplicity with aesthetics
            </Typography>
            <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button variant='outlined' sx={{ width: '80%' }}>
                Get Start
              </Button>
            </Box>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={7}
          xs={12}
          sx={{ pt: ['0 !important', '1.5rem !important'], pl: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              p: theme => `${theme.spacing(18, 5, 16)} !important`
            }}
          >
            <div>
              <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Typography variant='h6'>$</Typography>
                <Typography variant='h6' sx={{ lineHeight: 1, fontWeight: 600, fontSize: '3.75rem !important' }}>
                  899
                </Typography>
                <Typography variant='h6'>USD</Typography>
              </Box>
              <Typography variant='body2' sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}>
                <span>5 Tips For Offshore</span>
                <span>Software Development</span>
              </Typography>
              <Button variant='contained'>Contact Now</Button>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CardIntro
