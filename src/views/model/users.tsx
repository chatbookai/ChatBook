// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
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
  const [userStatus, setUserStatus] = useState<any>({});

  useEffect(() => {
    fetchData(paginationModel)
    console.log("isMobileData", isMobileData, id)
  }, [paginationModel])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user) {
      const data: any = {pageid: paginationModel.page, pagesize: paginationModel.pageSize}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/getusers', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS) {
        const userStatusNew = userStatus
        RS.data.map((Item: any)=>{
          userStatusNew[Item.id] = Item.user_status
        })
        setUserStatus(userStatusNew)
      }
      setStore(RS)  
    }
  }

  const handleUserStatus = async function (id: number, user_status: number) {
    if (auth && auth.user) {
      const data: any = {user_status: user_status, id:id}
      axios.post(authConfig.backEndApiChatBook + '/api/user/setuserstatus', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} })
    }
  }

  const handleSwitchChange = (id: number, checked: boolean) => {
    setUserStatus((prevUserStatus: any) => {
      const newUserStatus = { ...prevUserStatus, [id]: checked ? 1 : 0 };
      handleUserStatus(id, newUserStatus[id]);
      
      return newUserStatus;
    });
  };

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
      flex: 0.25,
      minWidth: 100,
      field: 'Username',
      headerName: `${t(`Username`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.username}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Role',
      headerName: `${t(`Role`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.role}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Access',
      headerName: `${t(`Access`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Switch checked={userStatus[row.id] == 1} onChange={(e: any)=>{
              e.preventDefault();
              const checked = e.target.checked;
              handleSwitchChange(row.id, checked);
            }} 
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Mobile',
      headerName: `${t(`Mobile`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.mobile}
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
            {new Date(Number(row.createtime)).toLocaleString()}
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
            <CardHeader title={`${t(`User Manage`)}`} />
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

