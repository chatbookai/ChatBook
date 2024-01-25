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

import { formatTimestamp } from 'src/configs/functions';

// ** Next Import
import { useRouter } from 'next/router'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'

const Files = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props

  // ** Hook
  const { t } = useTranslation()
  
  const router = useRouter()
  const { id } = router.query
  const isMobileData = isMobile()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    console.log(id, isMobileData, userId)
  }, [])

  useEffect(() => {
    fetchData(paginationModel)
  }, [paginationModel, knowledgeId])

  const fetchData = async function (paginationModel: any) {
    const RS = await axios.get('/api/files/' + knowledgeId + '/' + paginationModel.page + '/' + paginationModel.pageSize, { headers: { }, params: { } }).then(res=>res.data)
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
          <Typography noWrap variant='body2'>
            {row.id}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'Knowledge',
      headerName: `${t(`Knowledge`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        
        return (
          <Typography noWrap variant='body2'>
            {row.knowledge}
          </Typography>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 300,
      field: 'newName',
      headerName: `${t(`newName`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.newName}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'originalName',
      headerName: `${t(`originalName`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.originalName}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'Status',
      headerName: `${t(`Status`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.status}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'Time',
      minWidth: 220,
      headerName: `${t(`Time`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {formatTimestamp(row.timestamp)}
          </Typography>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
    
    {store && store.data != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${knowledgeName} ${t(`File Parse Process`)}`} />
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

export default Files

