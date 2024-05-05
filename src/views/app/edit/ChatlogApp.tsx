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

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import { CheckPermission } from 'src/functions/ChatBook'
import { formatTimestamp } from 'src/configs/functions'

const ChatlogApp = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  const { appId } = props

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [pageData, setPageData] = useState<any>({name: '', maxToken: 16000, returnReference: 0, ipLimitPerMinute: 100, expiredTime: '', authCheck: '', appId: appId, FormAction: 'addpublish', FormTitle: 'Create', FormSubmit: 'Add', FormTitleIcon: '/imgs/modal/shareFill.svg', openEdit: false, openDelete: false })

  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    fetchData(paginationModel)
    console.log("router", router)
  }, [paginationModel, counter, isMobileData, auth, appId])

  const fetchData = async function (paginationModel: any) {
    if (auth && auth.user && appId) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/chatlogstaticbyapp/' + appId + '/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(res=>res.data)
      console.log("RS", RS, "appId", appId)
      setStore(RS)  
    }
  }

  useEffect(() => {
    console.log("pageData", pageData)
  }, [pageData])

  const columns: GridColDef[] = [
    {
      flex: 1,
      minWidth: 50,
      field: 'publishId',
      headerName: `${t(`Name`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row.publishName}
          </Typography>
        )
      }
    },
    {
      flex: 1,
      minWidth: 100,
      field: 'userId',
      headerName: `${t(`userId`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2' >
            {row.userId}
          </Typography>
        )
      }
    },
    {
      flex: 0.8,
      minWidth: 100,
      field: 'chatCount',
      headerName: `${t(`chatCount`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {row.chatCount}
          </Typography>
        )
      }
    },
    {
      flex: 0.8,
      minWidth: 100,
      field: 'timestamp',
      headerName: `${t(`Date`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2' >
            {formatTimestamp(row.timestamp)}
          </Typography>
        )
      }
    }
  ]

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Grid container>
      {store && store.data != undefined ?
        <Grid item xs={12}>
          <Card>
            <Grid container>
                <Grid item xs={12} lg={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ my: 3, ml: 5 }}>{t('Chatlog')}</Typography>
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

export default ChatlogApp

