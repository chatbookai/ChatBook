// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'

import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
;import { Divider } from '@mui/material'
import { fontWeight, width } from '@mui/system'
<link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap' rel='stylesheet' />

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const WhyWithUsCard = () => {
  return (
    <Card>
      <Typography
              variant='h3'
              sx={{pt: ['0 !important', '2.5rem !important'], pl: ['1.5rem !important', '0 !important'], mb: 8.5, fontFamily: 'Cormorant Garamond', fontWeight: '700', textAlign: 'center' }}
            >
              Why Chatbook AI?
      </Typography>
      <Grid container spacing={8}>
        <Grid
            item
            sm={4}
            xs={12}
          >
            <Card>
              <CardContent>
                <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Icon icon="pajamas:nature" color='#336c34' fontSize={80} />
                </Box>
                <Typography variant='h4' sx={{ textAlign: 'center' ,mt:3 }}>
                  Netural
                </Typography>
                <Divider sx={{
                  pt: ['0 !important', '1.5rem !important'],
                  pl: ['1.5rem !important', '0 !important'],
                  width: '30%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderBottomWidth: 'thick'
                }} />

                <Box sx={{ p: theme => `${theme.spacing(10.25, 10.75, 8.25)} !important` }}>
                  <Typography variant='subtitle1' style={{ fontWeight: 500 ,fontSize: '18px'}}>  
                  "Experience the unbiased future of home searching with Chatbook AI. Our platform guarantees neutral suggestions, ensuring an objective and balanced perspective in your property hunt. Unlike traditional methods, Chatbook AI is designed to deliver impartial advice, free from any hidden agendas or biases. This commitment to neutrality empowers you to make choices that are truly in your best interest. "
                  </Typography>
                </Box>
              </CardContent>
              
            </Card>
          </Grid>
          <Grid
              item
              sm={4}
              xs={12}
            >
              <Card>
                <CardContent >
                  <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon icon='gala:secure' color='#336c34' fontSize={80} />
                  </Box>
                  <Typography variant='h4' sx={{ textAlign: 'center' ,mt:3 }}>
                    Secure
                  </Typography>
                  <Divider sx={{
                  pt: ['0 !important', '1.5rem !important'],
                  pl: ['1.5rem !important', '0 !important'],
                  width: '30%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderBottomWidth: 'thick'
                }} />
                <Box sx={{ p: theme => `${theme.spacing(10.25, 10.75, 8.25)} !important` }}>
                  <Typography variant='subtitle1' style={{ fontWeight: 500  ,fontSize: '18px' }}>  
                    "Privacy is our top priority. With Chatbook, you maintain your privacy while exploring or searching for your new home. By using Chatbook, your conversations remain confidential, ensuring that no personal information is divulged to real estate agents or third party leads pool. This autonomy not only safeguards your privacy but also empowers you to make well-informed decisions. Trust in Chatbook to keep your data secure and your home-buying experience transparent and self-directed."
                  </Typography>
                </Box>
                </CardContent>
                
              </Card>
          </Grid>
          <Grid
              item
              sm={4}
              xs={12}
            >
              <Card>
                <CardContent >
                  <Box sx={{ mt: 9.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon icon="ph:target-duotone" color='#336c34' fontSize={80}/>
                  </Box>
                  <Typography variant='h4' sx={{ textAlign: 'center' ,mt:3 }}>
                    Accurate
                  </Typography>
                  <Divider sx={{
                  pt: ['0 !important', '1.5rem !important'],
                  pl: ['1.5rem !important', '0 !important'],
                  width: '30%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderBottomWidth: 'thick'
                }} />
                <Box sx={{ p: theme => `${theme.spacing(10.25, 10.75, 8.25)} !important` }}>
                  <Typography variant='subtitle1' style={{ fontWeight: 500  ,fontSize: '18px' }}>  
                  "Unlock the precision of real-time intelligence with Chatbook AI. Our platform is powered by a constantly updated, verifiable knowledge base, ensuring your search results are not only accurate but also backed by credible sources. Chatbook AI provides exact references for its responses, allowing you to verify the information firsthand. Step into a world where clarity meets reliability, and make informed decisions with confidence. Trust Chatbook for up-to-date, factual, and transparent guidance in your home-buying journey."
                  </Typography>
                </Box>
                </CardContent>
              </Card>
          </Grid>
        
        
      </Grid>
    </Card>
  )
}

export default WhyWithUsCard
