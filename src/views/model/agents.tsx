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

import { formatTimestamp } from 'src/configs/functions';
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
import { CheckPermission } from 'src/functions/ChatBook'

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
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/agents/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
      console.log("RS", RS)
      setStore(RS)  
    }
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
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
      flex: 0.1,
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
      flex: 0.3,
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
      flex: 0.2,
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
      flex: 0.2,
      minWidth: 200,
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

  const [avator, setAvator] = useState<string>("")
  const [avatorError, setAvatorError] = useState<string | null>(null)
  const handleAvatorChange = (event: any) => {
    setAvator(event.target.value);
    if(event.target.value == "") {
        setAvatorError(`${t('This field cannot be empty')}`)
    }
    else {
        setAvatorError("")
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

  const [author, setAuthor] = useState<string>("")
  const [authorError, setAuthorError] = useState<string | null>(null)
  const handleAuthorChange = (event: any) => {
    setAuthor(event.target.value);
    if(event.target.value == "") {
        setAuthorError(`${t('This field cannot be empty')}`)
    }
    else {
        setAuthorError("")
    }
  }

  const handleCellClick = (value: any) => {
    setTitle(value.title)
    setDescription(value.description)
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
      const PostParams = {title, description, tags, config, avator, author, createDate:''}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/addagent', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit:", FormSubmit)
      if(FormSubmit?.status == "ok") {
          toast.success(t(FormSubmit.msg) as string, { duration: 4000 })
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
                          <TableCell>
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
                          <TableCell colSpan={3}>
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
                          <TableCell colSpan={3}>
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
                                  label={`${t('Avator')}`}
                                  placeholder={`${t('Avator')}`}
                                  value={avator}
                                  onChange={handleAvatorChange}
                                  InputProps={{
                                      startAdornment: (
                                          <InputAdornment position='start'>
                                          <Icon icon='mdi:account-outline' />
                                          </InputAdornment>
                                      )
                                  }}
                                  size="small"
                                  error={!!avatorError}
                                  helperText={avatorError}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              <TextField
                                  fullWidth
                                  label={`${t('Author')}`}
                                  placeholder={`${t('Author')}`}
                                  value={author}
                                  onChange={handleAuthorChange}
                                  InputProps={{
                                      startAdornment: (
                                          <InputAdornment position='start'>
                                          <Icon icon='mdi:account-outline' />
                                          </InputAdornment>
                                      )
                                  }}
                                  size="small"
                                  error={!!authorError}
                                  helperText={authorError}
                              />
                            </Typography>
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

