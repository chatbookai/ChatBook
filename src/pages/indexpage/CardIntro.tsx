// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
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

const CardIntro = () => {
  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={5}>
          <CardContent sx={{ 
              p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important`,
              height: '100%', // Ensure the content area fills the card.
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Center vertically.
              alignItems: 'center', // Center horizontally.
         }}>
            <Typography variant='h4' sx={{ mb: 3.5, fontFamily: 'Cormorant Garamond', fontWeight: '700' }}>
              Discover the Future of Real Estate AI Technology
            </Typography>
            <Typography variant='subtitle2'>
              Chatbook AI leverages cutting-edge AI to weave your home search and design aspirations into vivid,
             merging simplicity with aesthetics.
            </Typography>
            <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button variant='outlined' sx={{ width: '80%' }}>
                Get Started
              </Button>
            </Box>
          </CardContent>
        </Grid>
        <Grid item sm={7} xs={12}>
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
            src="/videos/Rabbits_Factory_4K_h264.mp4" // Replace with your video file path
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardIntro;