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
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

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

import CollectionNewEdit from './CollectionNewEdit'
import CollectionDelete from './CollectionDelete'


const Collection = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  const { datasetId } = props

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [pageData, setPageData] = useState<any>({name: '', type: 'File', files: [], csvs: [], trainingMode: 'Chunk Split', processWay: 'Auto process', datasetId: datasetId, FormAction: 'addcollection', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg', openEdit: false, openDelete: false })

  const [uploadProgress, setUploadProgress] = useState<any>({files: {}, csvs: {}})

  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    fetchData(paginationModel)
    console.log("router", router)
    setIsLoading(false)
  }, [paginationModel, counter, isMobileData, auth, datasetId])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user && datasetId) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/collectionbydataset/' + datasetId + '/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
      console.log("RS", RS, "datasetId", datasetId)
      setStore(RS)  
    }
  }

  useEffect(() => {
    console.log("pageData", pageData)
  }, [pageData])

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'name',
      headerName: `${t(`Name`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'dataTotal',
      headerName: `${t(`DataTotal`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row.dataTotal}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'updateTime',
      headerName: `${t(`UpdateTime`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.updateTime}
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
          <Typography noWrap variant='body2' >
            {row.status}
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
          <Button sx={{ my: 3, mr: 5 }} size="small" variant='outlined' onClick={
                        () => { 
                          console.log("Actions row", row)
                         }
                    }>
            {t("BeginUsing")}
          </Button>
          <Tooltip title={t('Edit')}>
            <IconButton size='small' onClick={
                        () => { setPageData( () => ({ ...row, openEdit: true, FormAction: 'editcollection', FormTitle: 'Edit', FormSubmit: 'Save', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
                    }>
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <IconButton size='small' onClick={
                        () => { setPageData( () => ({ ...row, openDelete: true, FormAction: 'deletecollection', FormTitle: 'Delete', FormSubmit: 'Confirm', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
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
          setPageData({openEdit: false, name: '', type: 'File', files: [], csvs: [], updateTime: 0, status: 100, expiredTime: '', authCheck: '', datasetId: datasetId})
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

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Grid container>
      {store && store.data != undefined ?
        <Grid item xs={12}>
          <Card>
            {pageData.openEdit == false ?
              <Grid container>
                  <Grid item xs={12} lg={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ my: 3, ml: 5 }}>{t('Data')}</Typography>
                      <Button sx={{ my: 3, mr: 5 }} size="small" variant='outlined' onClick={
                          () => { setPageData( (prevState: any) => ({ ...prevState, openEdit: true, FormAction: 'addcollection', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg' }) ) }
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
                  <CollectionDelete pageData={pageData} setPageData={setPageData} handleSubmit={handleSubmit} isDisabledButton={isDisabledButton}/>
              </Grid>
            : 
              <CollectionNewEdit pageData={pageData} setPageData={setPageData} handleSubmit={handleSubmit} isDisabledButton={isDisabledButton} uploadProgress={uploadProgress} setUploadProgress={setUploadProgress}/>
            }

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

export default Collection

