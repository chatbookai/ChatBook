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
import Avatar from '@mui/material/Avatar'
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

import ApplicationsNewEdit from './ApplicationsNewEdit'
import ApplicationsDelete from './ApplicationsDelete'

const Applications = () => {
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
  const [Applicationstatus, setApplicationstatus] = useState<any>({});
  const [search, setSearch] = useState<any>({ name:'', intro: ''});

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [pageData, setPageData] = useState<any>({FormAction: 'addapp', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg', openEdit: false, openDelete: false })
  
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    fetchData(paginationModel)
    console.log("router", router)
  }, [paginationModel, counter, isMobileData, auth])

  useEffect(() => {
    fetchData(paginationModel)
    console.log("isMobileData", isMobileData, id)
  }, [paginationModel, search])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user) {
      const data: any = {...search, pageid: paginationModel.page, pagesize: paginationModel.pageSize}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getapppageall/' + paginationModel.page + '/' + paginationModel.pageSize, data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS && RS.data) {
        const ApplicationstatusNew = Applicationstatus
        RS.data.map((Item: any)=>{
          ApplicationstatusNew[Item.id] = Item.user_status
        })
        setApplicationstatus(ApplicationstatusNew)
      }
      if(RS && RS.status && RS.status=='error' && RS.msg=='Token is invalid') {
        CheckPermission(auth, router, true)
      }
      setStore(RS)  
    }
  }

  const getAppById = async function (_id: string, id: string) {
    if (auth && auth.user) {
      const data: any = {appId: _id, id: id}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getappbyid', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setIsDisabledButton(false)
      return RS
    }
  }

  const handleApplicationstatus = async function (id: number, user_status: number) {
    if (auth && auth.user) {
      const data: any = {user_status: user_status, id:id}
      axios.post(authConfig.backEndApiChatBook + '/api/setApplicationstatus', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} })
    }
  }

  const handleSwitchChange = (id: number, checked: boolean) => {
    setApplicationstatus((prevApplicationstatus: any) => {
      const newApplicationstatus = { ...prevApplicationstatus, [id]: checked ? 1 : 0 };
      handleApplicationstatus(id, newApplicationstatus[id]);
      
      return newApplicationstatus;
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
      flex: 0.25,
      minWidth: 100,
      field: 'name',
      headerName: `${t(`Name`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2'>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'Intro',
      headerName: `${t(`Intro`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.intro}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Avatar',
      headerName: `${t(`Avatar`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Avatar src={authConfig.backEndApiChatBook + '/api/avatarforapp/' + row.avatar} variant="rounded" sx={{ width: '38px', height: '38px', borderRadius: '25px'}} />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Group',
      headerName: `${t(`Group`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2'>
              {row.groupOne}
            </Typography>
            <Typography noWrap variant='body2'>
              {row.groupTwo}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'permission',
      headerName: `${t(`Permission`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.permission}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'userId',
      headerName: `${t(`userId`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.userId}
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
                          const RS: any = await getAppById(row._id, row.id)
                          if(RS && RS['name']) {
                            setPageData( () => ({ ...RS, ...row, openEdit: true, FormAction: 'editapp', FormTitle: 'Edit', FormSubmit: 'Save', FormTitleIcon: '/imgs/modal/shareFill.svg' }) )
                          }
                         }
                    }>
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <IconButton size='small' onClick={
                        () => { setPageData( () => ({ ...row, openDelete: true, FormAction: 'deleteappbyid', FormTitle: 'Delete', FormSubmit: 'Confirm', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
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
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/' + pageData.FormAction, pageData, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
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
    setValue,
    formState: { errors }
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
                      <FormControl  sx={{ m: 1 }}>
                        <Controller
                          name='name'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField 
                              size='small'
                              autoFocus
                              label={`${t('Name')}`}
                              value={value}
                              onBlur={onBlur}
                              onChange={(e)=>{
                                onChange()
                                setValue('name', e.target.value)
                                setSearch((prevState: any)=>{
                                  const New = {...prevState, name: e.target.value}
                                  return New
                                })
                              }}
                              error={Boolean(errors.name)}
                              placeholder=''
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl  sx={{ m: 1 }}>
                        <Controller
                          name='intro'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField 
                              size='small'
                              autoFocus
                              label={`${t('Intro')}`}
                              value={value}
                              onBlur={onBlur}
                              onChange={(e)=>{
                                onChange()
                                setValue('intro', e.target.value)
                                setSearch((prevState: any)=>{
                                  const New = {...prevState, intro: e.target.value}
                                  return New
                                })
                              }}
                              error={Boolean(errors.intro)}
                              placeholder=''
                            />
                          )}
                        />
                      </FormControl>
                    </Box>
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
                <ApplicationsNewEdit pageData={pageData} setPageData={setPageData} handleSubmit={handleSubmit} isDisabledButton={isDisabledButton}/>
                <ApplicationsDelete pageData={pageData} setPageData={setPageData} handleSubmit={handleSubmit} isDisabledButton={isDisabledButton}/>
                
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

export default Applications

