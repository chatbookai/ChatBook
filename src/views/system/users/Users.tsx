// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import FormControl from '@mui/material/FormControl'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import { CheckPermission } from 'src/functions/ChatBook'

import UsersNewEdit from './UsersNewEdit'
import UsersDelete from './UsersDelete'

const Users = () => {
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
  const [userStatus, setUserStatus] = useState<any>({});
  const [search, setSearch] = useState<any>({ email:'', mobile: ''});

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [pageData, setPageData] = useState<any>({FormAction: 'adduser', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg', openEdit: false, openDelete: false })
  
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    fetchData(paginationModel)
    console.log("router", router)
  }, [paginationModel, counter, isMobileData, auth])

  useEffect(() => {
    fetchData(paginationModel)
    console.log("isMobileData", isMobileData, id)
  }, [paginationModel])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user) {
      const data: any = {pageid: paginationModel.page, pagesize: paginationModel.pageSize}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/getusers', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS && RS.data) {
        const userStatusNew = userStatus
        RS.data.map((Item: any)=>{
          userStatusNew[Item.id] = Item.user_status
        })
        setUserStatus(userStatusNew)
      }
      if(RS && RS.status && RS.status=='error' && RS.msg=='Token is invalid') {
        CheckPermission(auth, router, true)
      }
      setStore(RS)  
    }
  }

  const getUserInfoByEmail = async function (email: string) {
    if (auth && auth.user) {
      const data: any = {email}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/getuserbyid', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setIsDisabledButton(false)
      return RS
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
    },
    {
      flex: 0.16,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('Edit')}>
            <IconButton size='small' onClick={
                        async () => { 
                          const RS: any = await getUserInfoByEmail(row.email)
                          if(RS && RS['status'] == 'ok') {
                            setPageData( () => ({ ...row, openEdit: true, FormAction: 'edituser', FormTitle: 'Edit', FormSubmit: 'Save', FormTitleIcon: '/imgs/modal/shareFill.svg' }) )
                          }
                         }
                    }>
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <IconButton size='small' onClick={
                        () => { setPageData( () => ({ ...row, openDelete: true, FormAction: 'deleteuser', FormTitle: 'Delete', FormSubmit: 'Confirm', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
                    }>
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleSubmit = async () => {

    if (auth && auth.user && pageData && pageData.FormAction) {
      setIsDisabledButton(true)
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/user/' + pageData.FormAction, pageData, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit:", FormSubmit)
      if(FormSubmit?.status == "ok") {
          toast.success(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          setPageData({openEdit: false})
      }
      else {
          toast.error(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          if(FormSubmit && FormSubmit.msg=='Token is invalid') {
            CheckPermission(auth, router, true)
          }
      }
      setCounter(counter + 1)
      setIsDisabledButton(false)
    }

  }

  const schema = yup.object().shape({
  })
  const {
    control,
    setError,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: search,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Grid container>
      {store && store.data != undefined ?
        <Grid item xs={12}>
          <Card>
            <Grid container>
                <Grid item xs={12} lg={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ml: 2, mt: 2}}>
                      <FormControl  sx={{ mb: 1 }}>
                        <Controller
                          name='email'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField 
                              size='small'
                              autoFocus
                              label={`${t('Email')}`}
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.email)}
                              placeholder=''
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl  sx={{ ml: 2, mb: 1 }}>
                        <Controller
                          name='username'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField 
                              size='small'
                              autoFocus
                              label={`${t('Username')}`}
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.username)}
                              placeholder=''
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl  sx={{ ml: 2, mb: 1 }}>
                        <Controller
                          name='mobile'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField 
                              size='small'
                              autoFocus
                              label={`${t('Mobile')}`}
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.mobile)}
                              placeholder=''
                            />
                          )}
                        />
                      </FormControl>
                    </Box>
                    <Button sx={{ my: 3, mr: 5 }} size="small" variant='outlined' onClick={
                        () => { setPageData( () => ({ openEdit: true, FormAction: 'adduser', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
                    }>
                    {t("Add")}
                    </Button>
                </Grid>
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
                <UsersNewEdit pageData={pageData} setPageData={setPageData} handleSubmit={handleSubmit} isDisabledButton={isDisabledButton}/>
                <UsersDelete pageData={pageData} setPageData={setPageData} handleSubmit={handleSubmit} isDisabledButton={isDisabledButton}/>
                
            </Grid>
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

export default Users

