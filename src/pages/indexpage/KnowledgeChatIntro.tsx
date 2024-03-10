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

const ImageIntro = () => {
  const [value, setValue] = useState('1')

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={5} sx={{ display: 'flex' }}>
            <CardContent sx={{ 
                p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important`,
                height: '100%', // Ensure the content area fills the card.
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center vertically.
                alignItems: 'left', // Center horizontally.
                 }}>
                <Typography variant='h4' sx={{ mb: 3.5, fontFamily: 'Cormorant Garamond', fontWeight: '700' }}>
                Chatbook: Your AI Real Estate Assistant
                </Typography>
                <Typography variant='subtitle2'>
                "Navigate the real estate market with ease using Chatbook, your AI-powered property guide. Access comprehensive, real-time listings and receive tailored advice in an instant. With Chatbook, finding your ideal home becomes a seamless, conversation-driven experience. Start your simplified home search with Chatbook today."
                </Typography>
                <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant='outlined' sx={{ width: '50%' }}>
                    chat now
                </Button>
                </Box>
            </CardContent>
        </Grid>
        <Grid
          item
          sm={7}
          xs={12}
          sx={{ display: 'flex', pt: ['3.5 !important', '5.5rem !important'], pb: ['2.5rem !important', '5.5 !important'], pr: ['2.5rem !important', '2.5 !important'] }}
        >
          <CardMedia
            component="video"
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              p: theme => `${theme.spacing(3)} !important`, // Adjust padding as needed
            }}
            autoPlay
            muted // Recommended to start muted if autoplaying
            loop
            controls={false} // Initially hide controls, they can appear on hover or tap
            src="/videos/Vancouver_Dawn.mp4" // Replace with your video file path
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default ImageIntro
