import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import CardMedia from '@mui/material/CardMedia'

import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
;<link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap' rel='stylesheet' />

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ContactUs = () => {
  const [value, setValue] = useState('1')

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CardContent sx={{ 
                p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important`,
                height: '100%', // Ensure the content area fills the card.
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center vertically.
                alignItems: 'left', // Center horizontally.
                 }}>
                <Typography variant='h4' sx={{ mb: 3.5, fontFamily: 'Cormorant Garamond', fontWeight: '700' }}>
                Early Innovators Pilot Program
                </Typography>
                <Typography variant='subtitle2'>
                Embark on a visionary AI journey with our free pilot program and tap into the expansive community of Collov enthusiasts, propelling your brand into the future.
                </Typography>
                <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant='outlined' sx={{ width: '50%' }}>
                    Contact Us
                </Button>
                </Box>
            </CardContent>
        </Grid>
        <Grid
          item
          sm={3}
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: ['3.5 !important', '5.5rem !important'], pb: ['2.5rem !important', '5.5 !important'], pr: ['2.5rem !important', '2.5 !important'] }}
        >
          <CardContent sx={{
                p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important`,
                height: '100%', // Ensure the content area fills the card.
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center vertically.
                alignItems: 'center', // Center horizontally.
            }}>
                <CardMedia
                   component="img" // Specify the component type as 'img'
                   height="100%" // Set the height of the image
                   width= "100%" // Set the width of the image
                   image="/images/cards/teams.svg" // Path to your image
                   alt="Descriptive text" // Alternative text for accessibility
                />
        </CardContent>
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        </Grid> 
      </Grid>
    </Card>
  )
}

export default ContactUs
