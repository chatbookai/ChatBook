// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import { CheckPermission } from 'src/functions/ChatBook'

const TabLogs = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])
  
  const { id } = router.query
  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    fetchData(paginationModel)
    console.log("isMobileData", isMobileData, id)
  }, [paginationModel, counter])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/logs/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
      console.log("RS", RS)
      setStore(RS)  
    }
  }

  const clearShortLogs = async function () {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/logs/clearshortlogs', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
      if(RS['status'] == 'ok') {
        toast.success(t(RS['msg']) as string, { duration: 1000 })
        setCounter(counter+1)
      }
    }
  }

  const clearAllLogs = async function () {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/logs/clearalllogs', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
      if(RS['status'] == 'ok') {
        toast.success(t(RS['msg']) as string, { duration: 1000 })
        setCounter(counter+1)
      }
    }
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const columns: GridColDef[] = [
    {
      flex: 0.05,
      minWidth: 100,
      field: 'id',
      headerName: `${t(`id`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2'>
            {row.id}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Datetime',
      headerName: `${t(`Datetime`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2'>
            {row.datetime}
          </Typography>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 500,
      field: 'Content',
      headerName: `${t(`Content`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.content}
          </Typography>
        )
      }
    }
  ]

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Grid container spacing={6}>    
      {store && store.data != undefined ?
        <Grid item xs={12}>
          <Card>
          <Box sx={{ display: 'flex', alignItems: 'center', m: 2, p: 2 }}>
            <Typography noWrap variant='h6'>
              {t(`System Logs`)}
            </Typography>
            <Button color='success' size="small" style={{ whiteSpace: 'nowrap' }} sx={{ml: 2}}
                    onClick={()=>clearShortLogs()}>
              {t(`Clear Short Logs`)}
            </Button>
            <Button color='success' size="small" style={{ whiteSpace: 'nowrap' }} sx={{ml: 2}}
                    onClick={()=>clearAllLogs()}>
              {t(`Clear All Logs`)}
            </Button>
          </Box>
            <Divider />
            <DataGrid
              autoHeight
              rows={store.data}
              rowCount={store.total as number}
              columns={columns}
              sortingMode='server'
              paginationMode='server'
              filterMode="server"
              loading={isLoading}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 15, 20, 30, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableColumnMenu={true}
            />
          </Card>
        </Grid>
        :
        <Fragment></Fragment>
      }
      </Grid>
      :
      null
      }
    </Fragment>
  )
}

export default TabLogs

