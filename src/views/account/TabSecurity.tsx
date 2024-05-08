// ** React Imports
import { useState, useEffect, Fragment } from 'react'

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
import ChangePasswordCard from 'src/views/account/security/ChangePasswordCard'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'

const TabSecurity = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  // ** Hook
  const [recentDeviceData, setRecentDeviceData] = useState<any[]>([])

  const fetchData = async function () {
    if (auth && auth.user) {
      const data: any = {pageid: 0, pagesize: 6}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/getuserlogs', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS && RS.data) {
        setRecentDeviceData(RS.data)
      }
    }    
  }

  useEffect(() => {
    fetchData()  
  }, [])

  const BrowserTypeIcon: any = {}
  BrowserTypeIcon['Windows'] = "mdi:microsoft-windows"
  BrowserTypeIcon['iPhone'] = "mdi:cellphone"
  BrowserTypeIcon['Android'] = "mdi:android"
  BrowserTypeIcon['MacOS'] = "mdi:apple"

  return (
    <Fragment>
      {auth.user && auth.user.email ? 
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ChangePasswordCard />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={`${t('Recent Devices')}`} />
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: 'customColors.tableHeaderBg' }}>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${t('Browser')}`}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${t('Device')}`}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${t('Ip')}`}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${t('Location')}`}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${t('Recent Activities')}`}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{`${t('Action')}`}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentDeviceData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box component='span' sx={{ mr: 2.5, '& svg': { color: 'info.main' } }}>
                            <Icon icon={`${BrowserTypeIcon[row.os] ?? 'mdi:microsoft-windows'}`} fontSize={20} />
                          </Box>
                          <Typography sx={{ whiteSpace: 'nowrap' }}>{row.browsertype}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                          {row.device}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                          {row.ipaddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                          {row.location}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                          {new Date(Number(row.recentactivities)).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                          {row.action}
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
      :
      null
      }
    </Fragment>
  )
}
export default TabSecurity
