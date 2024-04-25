// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import LeftWorkflow from 'src/views/workflow/edit/LeftWorkflow'

import ContentWorkflow from 'src/views/workflow/edit/ContentWorkflow';

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

const EditWorkflow = () => {
  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [workflow, setWorkflow] = useState<any>(null)
  const [workflowId, setWorkflowId] = useState<string>("")
  const [workflowName, setWorkflowName] = useState<string>("")

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const { settings } = useSettings()
  const auth = useAuth()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const fetchData = async function (id: string) {
    if (auth && auth.user && id) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/getworkflow/' + id, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setWorkflow(RS)
    }
  }

  const setActiveId = function (Id: number, Name: string) {
    setWorkflowId(Id)
    setWorkflowName(Name)
    setRefreshChatCounter(0)
  }

  useEffect(() => {
    fetchData(id)  
  }, [refreshChatCounter, id])

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <LeftWorkflow
          workflow={workflow}
          hidden={false}
        />
        <ContentWorkflow workflowId={workflowId} workflowName={workflowName} userId={'1'}/>
        <ContentWorkflow workflowId={workflowId} workflowName={workflowName} userId={'1'}/>
      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default EditWorkflow

