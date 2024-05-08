// ** React Imports
import { SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

interface TableDataType {
  type: string
  app: boolean
  email: boolean
  browser: boolean
}

const data: TableDataType[] = [
  {
    app: true,
    email: true,
    browser: true,
    type: 'New for you'
  },
  {
    app: true,
    email: true,
    browser: true,
    type: 'Account activity'
  },
  {
    app: false,
    email: true,
    browser: true,
    type: 'A new browser used to sign in'
  },
  {
    app: false,
    email: true,
    browser: false,
    type: 'A new device is linked'
  }
]

const TabNotifications = () => {
  return (
    <Card>
      <CardHeader title='Recent Devices' sx={{ pb: 4 }} />
      <CardContent>
        <Typography sx={{ color: 'text.secondary' }}>
          We need permission from your browser to show notifications.{' '}
          <Box
            href='/'
            component={'a'}
            onClick={(e: SyntheticEvent) => e.preventDefault()}
            sx={{ textDecoration: 'none', color: 'primary.main' }}
          >
            Request Permission
          </Box>
        </Typography>
      </CardContent>

      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Email</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Browser</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.type}>
                <TableCell>
                  <Typography sx={{ whiteSpace: 'nowrap' }}>{row.type}</Typography>
                </TableCell>
                <TableCell>
                  <Checkbox defaultChecked={row.email} />
                </TableCell>
                <TableCell>
                  <Checkbox defaultChecked={row.browser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Button variant='contained' sx={{ mr: 4 }}>
              Save Changes
            </Button>
            <Button variant='outlined' color='secondary'>
              Discard
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TabNotifications
