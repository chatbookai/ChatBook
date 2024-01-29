// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components
import ChangePasswordCard from 'src/views/pages/account-settings/security/ChangePasswordCard'

interface RecentDeviceDataType {
  date: string
  device: string
  location: string
  browserName: string
  browserIcon: ReactNode
}

const recentDeviceData: RecentDeviceDataType[] = [
  {
    location: 'Switzerland',
    device: 'HP Spectre 360',
    date: '10, July 2021 20:07',
    browserName: 'Chrome on Windows',
    browserIcon: (
      <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'info.main' } }}>
        <Icon icon='mdi:microsoft-windows' fontSize={20} />
      </Box>
    )
  },
  {
    location: 'Australia',
    device: 'iPhone 12x',
    date: '13, July 2021 10:10',
    browserName: 'Chrome on iPhone',
    browserIcon: (
      <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'error.main' } }}>
        <Icon icon='mdi:cellphone' fontSize={20} />
      </Box>
    )
  },
  {
    location: 'Dubai',
    device: 'Oneplus 9 Pro',
    date: '14, July 2021 15:15',
    browserName: 'Chrome on Android',
    browserIcon: (
      <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'success.main' } }}>
        <Icon icon='mdi:android' fontSize={20} />
      </Box>
    )
  },
  {
    location: 'India',
    device: 'Apple iMac',
    date: '16, July 2021 16:17',
    browserName: 'Chrome on MacOS',
    browserIcon: (
      <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'secondary.main' } }}>
        <Icon icon='mdi:apple' fontSize={20} />
      </Box>
    )
  },
  {
    location: 'Switzerland',
    device: 'HP Spectre 360',
    date: '20, July 2021 21:01',
    browserName: 'Chrome on Windows',
    browserIcon: (
      <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'info.main' } }}>
        <Icon icon='mdi:microsoft-windows' fontSize={20} />
      </Box>
    )
  },
  {
    location: 'Dubai',
    device: 'Oneplus 9 Pro',
    date: '21, July 2021 12:22',
    browserName: 'Chrome on Android',
    browserIcon: (
      <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'success.main' } }}>
        <Icon icon='mdi:android' fontSize={20} />
      </Box>
    )
  }
]

const TabSecurity = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ChangePasswordCard />
      </Grid>

      {/* Recent Devices Card*/}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Recent Devices' />
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'customColors.tableHeaderBg' }}>
                <TableRow>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Browser</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Device</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Location</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Recent Activities</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentDeviceData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.browserIcon}
                        <Typography sx={{ whiteSpace: 'nowrap' }}>{row.browserName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                        {row.device}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                        {row.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                        {row.date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}
export default TabSecurity
