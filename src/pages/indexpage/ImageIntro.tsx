import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import ImageSwitcher from './ImageSwitcher'
import TabsVertical from './TabsVertical'

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
        <Grid item xs={12} sm={5}>
          <CardContent sx={{ 
              p: theme => `${theme.spacing(8.25, 6.75, 6.25)} !important`,
              height: '100%', // Ensure the content area fills the card.
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Center vertically.
              alignItems: 'left', // Center horizontally.
         }}>
            <Typography variant='h4' sx={{ mb: 3.5, fontFamily: 'Cormorant Garamond', fontWeight: '700' }}>
              Use the power of AI Imaging to demonstrate your home
            </Typography>
            <Typography variant='subtitle2'>
              Unleash the Power of AI Imaging: Transform, Tidy, and Redesign Your Home with Ease! Discover how our
              cutting-edge AI can help you beautify, clean, and completely reimagine your living spaces, making your
              dream home a reality.
            </Typography>
            <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button variant='outlined' sx={{ width: '50%' }}>
                Try it out
              </Button>
            </Box>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={7}
          xs={12}
          sx={{ display: 'flex', pt: ['0 !important', '1.5rem !important'], pl: ['1.5rem !important', '0 !important'] }}
        >
          <Grid item sm={3} xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TabsVertical value={value} setValue={setValue} />
          </Grid>
          <Grid item sm={9} xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ImageSwitcher value={value} />
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default ImageIntro
