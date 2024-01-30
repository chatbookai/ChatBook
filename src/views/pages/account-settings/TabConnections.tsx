// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

interface ConnectedAccountsType {
  title: string
  logo: string
  checked: boolean
  subtitle: string
}

const connectedAccountsArr: ConnectedAccountsType[] = [
  {
    checked: true,
    title: 'Google',
    logo: '/images/logos/google.png',
    subtitle: t('Google Account')
  },
  {
    checked: true,
    title: 'Github',
    logo: '/images/logos/github.png',
    subtitle: t('Github Account')
  }
]

const TabConnections = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Grid container spacing={5}>
        {/* Connected Accounts Cards */}
        <Grid item xs={12} md={6}>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6'>{`${t('Connected Accounts')}`}</Typography>
              <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                {`${t('Display content from your connected accounts on your site')}`}
              </Typography>
            </Box>
            {connectedAccountsArr.map(account => {
              return (
                <Box
                  key={account.title}
                  sx={{
                    gap: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '&:not(:last-of-type)': { mb: 4 }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 2.5, display: 'flex', justifyContent: 'center' }}>
                      <img src={account.logo} alt={account.title} height='30' width='30' />
                    </Box>
                    <div>
                      <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{account.title}</Typography>
                      <Typography variant='body2'>{account.subtitle}</Typography>
                    </div>
                  </Box>
                  <Switch defaultChecked={account.checked} />
                </Box>
              )
            })}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TabConnections
