// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import LeftWorkflow from 'src/views/workflow/edit/LeftWorkflow'

import SimpleEdit from 'src/views/workflow/edit/SimpleEdit'
import PreviewWorkflow from 'src/views/workflow/edit/PreviewWorkflow'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

const EditWorkflow = (props: any) => {
  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [workflow, setWorkflow] = useState<any>(null)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)

  const { menuid } = props

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

  const handleEditWorkflow = async () => {
    console.log("handleEditWorkflow workflow", workflow)
    setIsDisabledButton(true)
    if (auth && auth.user) {
      const workflowNew = {
        ...workflow,
        updateTime: String(new Date(Date.now()).toLocaleString()),
        mode: 'simple'
      }
      const PostParams = {name: workflow.name, _id: workflowNew._id, teamId: workflowNew.teamId, intro: workflowNew.intro, avatar: workflowNew.avatar, type: workflowNew.type, flowGroup: workflow.flowGroup, permission: workflowNew.permission, data: workflowNew}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/editworkflow', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      setIsDisabledButton(false)
    }
  }

  useEffect(() => {
    if(id) {
      fetchData(String(id))  
    }
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
        <LeftWorkflow workflow={workflow} hidden={false} menuid={menuid} />
        <SimpleEdit workflow={workflow} setWorkflow={setWorkflow} handleEditWorkflow={handleEditWorkflow} isDisabledButton={isDisabledButton} />
        <PreviewWorkflow workflow={workflow} hidden={false} />
      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default EditWorkflow

