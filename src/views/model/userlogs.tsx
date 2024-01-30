// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import { CheckPermission } from 'src/functions/ChatBook'

const Logs = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router)
  }, [])
  
  const { id } = router.query
  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    fetchData(paginationModel)
    console.log("isMobileData", isMobileData, id)
  }, [paginationModel])

  const fetchData = async function (paginationModel: any) {
    if (auth.user) {
      const data: any = {pageid: paginationModel.page, pagesize: paginationModel.pageSize}
      const RS = await axios.post('/api/user/getuserlogsall', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      console.log("RS", RS)
      setStore(RS)  
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
      flex: 0.3,
      minWidth: 100,
      field: 'Email',
      headerName: `${t(`Email`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Browser',
      headerName: `${t(`Browser`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.browsertype}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'OS',
      headerName: `${t(`OS`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.os}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Device',
      headerName: `${t(`Device`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.device}
          </Typography>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'Location',
      headerName: `${t(`Location`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.location}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'Ip',
      headerName: `${t(`Ip`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.ipaddress}
          </Typography>
        )
      }
    },
    {
      flex: 0.23,
      minWidth: 100,
      field: 'Create Time',
      headerName: `${t(`Create Time`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {new Date(Number(row.recentactivities)).toLocaleString()}
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
            <CardHeader title={`${t(`User Logs`)}`} />
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

export default Logs

