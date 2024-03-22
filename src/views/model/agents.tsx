// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

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
import { CheckPermission, GetAllLLMS } from 'src/functions/ChatBook'

const Agents = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    fetchData(paginationModel)
    console.log("router", router)
  }, [paginationModel, counter, isMobileData])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/agentsall/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
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
      minWidth: 50,
      field: 'id',
      headerName: `${t(`id`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.id}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'title',
      headerName: `${t(`title`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.title}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 300,
      field: 'description',
      headerName: `${t(`description`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.description}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'tags',
      headerName: `${t(`tags`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.tags}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'createDate',
      headerName: `${t(`createDate`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.createDate}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'model',
      headerName: `${t(`Model`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.model}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'status',
      headerName: `${t(`Status`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.status}
          </Typography>
        )
      }
    }
  ]

  const [title, setTitle] = useState<string>("")
  const [titleError, setTitleError] = useState<string | null>(null)
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    if(event.target.value == "") {
      setTitleError(`${t('This field cannot be empty')}`)
    }
    else {
      setTitleError("")
    }
  }

  const [description, setDescription] = useState<string>("")
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
    if(event.target.value == "") {
        setDescriptionError(`${t('This field cannot be empty')}`)
    }
    else {
        setDescriptionError("")
    }
  }

  const [avatar, setAvatar] = useState<string>("")
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const handleAvatarChange = (event: any) => {
    setAvatar(event.target.value);
    if(event.target.value == "") {
        setAvatarError(`${t('This field cannot be empty')}`)
    }
    else {
        setAvatarError("")
    }
  }

  const [tags, setTags] = useState<string>("")
  const [tagsError, setTagsError] = useState<string | null>(null)
  const handleTagsChange = (event: any) => {
    setTags(event.target.value);
    if(event.target.value == "") {
        setTagsError(`${t('This field cannot be empty')}`)
    }
    else {
        setTagsError("")
    }
  }

  const [config, setConfig] = useState<string>("")
  const [configError, setConfigError] = useState<string | null>(null)
  const handleConfigChange = (event: any) => {
    setConfig(event.target.value);
    if(event.target.value == "") {
        setConfigError(`${t('This field cannot be empty')}`)
    }
    else {
        setConfigError("")
    }
  }

  const [status, setStatus] = useState<string>("")
  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);
  }
  const StatusList: any[] = []
  StatusList.push({name: "Disable", id: 0})
  StatusList.push({name: "Enable", id: 1})

  const [modelValue, setModelValue] = useState<string>('Gemini')
  const ModelList: any[] = []
  const GetAllLLMSData = GetAllLLMS()
  GetAllLLMSData.map((Item: any)=>{
    ModelList.push({name: Item.name, id: Item.id})
  })
  const handleModelChange = (event: any) => {
    setModelValue(event.target.value);
  }

  const handleCellClick = (value: any) => {
    setTitle(value.title)
    setDescription(value.description)
    setStatus(value.status)
    setAvatar(value.avatar)
    setConfig(value.config)
    setTags(value.tags)
    setStatus(value.status)
    setModelValue(value.model)
  }

  const handleSubmit = async () => {
    if(title == "") {
        toast.error(t("Title cannot be empty") as string, { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }
    if(description == "") {
        toast.error(t("Description cannot be empty") as string, { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }

    if (auth && auth.user) {
      const PostParams = {title, description, tags, config, avatar, status, model: modelValue, type: 1, author: ''}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/addagent', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit:", FormSubmit)
      if(FormSubmit?.status == "ok") {
          toast.success(t(FormSubmit.msg) as string, { duration: 4000 })
          setTitle('')
          setDescription('')
          setStatus('')
          setAvatar('')
          setConfig('')
          setTags('')
      }
      else {
          toast.error(t(FormSubmit.msg) as string, { duration: 4000 })
          if(FormSubmit && FormSubmit.msg=='Token is invalid') {
            CheckPermission(auth, router, true)
          }
      }
      setCounter(counter + 1)
    }

  }

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Grid container spacing={6}>
      {store && store.data != undefined ?
        <Grid item xs={12}>
          <Card>
            <CardHeader title={`${t(`Agents`)}`} />
            <CardContent>

              <Grid container spacing={6}>
                <Grid item xs={12} lg={12}>
                  <TableContainer>
                    <Table size='small' sx={{ width: '95%' }}>
                      <TableBody
                        sx={{
                          '& .MuiTableCell-root': {
                            border: 0,
                            pt: 2,
                            pb: 2.5,
                            pl: '2 !important',
                            pr: '2 !important'
                          }
                        }}
                      >
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <TextField
                                  fullWidth
                                  label={`${t('Title')}`}
                                  placeholder={`${t('Title')}`}
                                  value={title}
                                  onChange={handleTitleChange}
                                  InputProps={{
                                      startAdornment: (
                                          <InputAdornment position='start'>
                                          <Icon icon='mdi:account-outline' />
                                          </InputAdornment>
                                      )
                                  }}
                                  size="small"
                                  error={!!titleError}
                                  helperText={titleError}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <TextField
                                  fullWidth
                                  label={`${t('Tags')}`}
                                  placeholder={`${t('Tags')}`}
                                  value={tags}
                                  onChange={handleTagsChange}
                                  InputProps={{
                                      startAdornment: (
                                          <InputAdornment position='start'>
                                          <Icon icon='mdi:account-outline' />
                                          </InputAdornment>
                                      )
                                  }}
                                  size="small"
                                  error={!!tagsError}
                                  helperText={tagsError}
                              />
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <TextField
                                  fullWidth
                                  multiline
                                  rows={4}
                                  label={`${t('Description')}`}
                                  placeholder={`${t('Description')}`}
                                  value={description}
                                  onChange={handleDescriptionChange}
                                  size="small"
                                  error={!!descriptionError}
                                  helperText={descriptionError}
                              />
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <TextField
                                  fullWidth
                                  multiline
                                  rows={5}
                                  label={`${t('Config')}`}
                                  placeholder={`${t('Config')}`}
                                  value={config}
                                  onChange={handleConfigChange}
                                  size="small"
                                  error={!!configError}
                                  helperText={configError}
                              />
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <TextField
                                  fullWidth
                                  label={`${t('Avatar')}`}
                                  placeholder={`${t('Avatar')}`}
                                  value={avatar}
                                  onChange={handleAvatarChange}
                                  InputProps={{
                                      startAdornment: (
                                          <InputAdornment position='start'>
                                          <Icon icon='mdi:account-outline' />
                                          </InputAdornment>
                                      )
                                  }}
                                  size="small"
                                  error={!!avatarError}
                                  helperText={avatarError}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell>
                            
                          <FormControl fullWidth>
                            <InputLabel >{t('Status') as string}</InputLabel>
                            <Select
                              label={t('Status') as string}
                              defaultValue={status}
                              value={status}
                              size="small"
                              onChange={handleStatusChange}
                            >
                              {StatusList.map((Item: any, Index: number)=>{
                                return (<MenuItem key={Index} value={Item.id}>{Item.name}</MenuItem>)                          
                              })}
                            </Select>
                          </FormControl>
                          </TableCell>
                          <TableCell>
                          <FormControl fullWidth>
                            <InputLabel >{t('Model') as string}</InputLabel>
                            <Select
                              label={t('Model') as string}
                              defaultValue={modelValue}
                              value={modelValue}
                              size="small"
                              onChange={handleModelChange}
                            >
                              {ModelList.map((Item: any, Index: number)=>{
                                return (<MenuItem key={Index} value={Item.id}>{Item.name}</MenuItem>)                          
                              })}
                            </Select>
                          </FormControl>
                          </TableCell>
                          <TableCell>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <Button type='submit' variant='contained' onClick={handleSubmit} disabled={isDisabledButton} >
                                  {uploadingButton}
                              </Button>
                            </Typography>
                          </TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

            </CardContent>
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

export default Agents

