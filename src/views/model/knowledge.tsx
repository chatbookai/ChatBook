// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** Axios Imports
import axios from 'axios'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'


const Knowledge = () => {
  // ** Hook
  const { t } = useTranslation()

  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const router = useRouter()
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
    const RS = await axios.get('/api/knowledge/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { }, params: { } }).then(res=>res.data)
    console.log("RS", RS)
    setStore(RS)  
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
      field: 'name',
      headerName: `${t(`name`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 300,
      field: 'summary',
      headerName: `${t(`summary`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {row.summary}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'timestamp',
      headerName: `${t(`timestamp`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' onClick={() => handleCellClick(row)}>
            {formatTimestamp(row.timestamp)}
          </Typography>
        )
      }
    }
  ]

  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string | null>(null)
  const handleNameChange = (event: any) => {
    setName(event.target.value);
    if(event.target.value == "") {
        setNameError(`${t('This field cannot be empty')}`)
    }
    else {
        setNameError("")
    }
  }

  const [summary, setSummary] = useState<string>("")
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const handleSummaryChange = (event: any) => {
    setSummary(event.target.value);
    if(event.target.value == "") {
        setSummaryError(`${t('This field cannot be empty')}`)
    }
    else {
        setSummaryError("")
    }
  }

  const handleCellClick = (value: any) => {
    setName(value.name)
    setSummary(value.summary)
  }

  const handleSubmit = async () => {
    if(name == "") {
        toast.error("Name cannot be empty", { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }
    if(summary == "") {
        toast.error("Summary cannot be empty", { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }

    const PostParams = {name, summary}
    const FormSubmit: any = await axios.post('/api/addknowledge', PostParams).then(res => res.data)
    console.log("FormSubmit:", FormSubmit)
    if(FormSubmit?.status == "ok") {
        toast.success(FormSubmit.msg, { duration: 4000 })
    }
    else {
        toast.error(FormSubmit.msg, { duration: 4000 })
    }
    setCounter(counter + 1)

  }

  return (
    <Grid container spacing={6}>
    
    {store && store.data != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`Knowledge`)}`} />
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
                                label={`${t('Name')}`}
                                placeholder={`${t('Name')}`}
                                value={name}
                                onChange={handleNameChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                size="small"
                                error={!!nameError}
                                helperText={nameError}
                            />
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            <TextField
                                fullWidth
                                label={`${t('Summary')}`}
                                placeholder={`${t('Summary')}`}
                                value={summary}
                                onChange={handleSummaryChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                size="small"
                                error={!!summaryError}
                                helperText={summaryError}
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
  )
}

export default Knowledge

