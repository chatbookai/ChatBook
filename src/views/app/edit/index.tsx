// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import IdNotExist from 'src/pages/404IdNotExist'

// ** Chat App Components Imports
import LeftApp from 'src/views/app/edit/LeftApp'

import SimpleEdit from 'src/views/app/edit/SimpleEdit'
import PublishApp from 'src/views/app/edit/PublishApp'
import ChatlogApp from 'src/views/app/edit/ChatlogApp'
import ChatIndex from 'src/views/app/chat/ChatIndex'

// ** Axios Imports
import toast from 'react-hot-toast'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

const EditApp = (props: any) => {
  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [app, setApp] = useState<any>(null)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false) 

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

  const getMyApp = async function (id: string) {
    if (auth && auth.user && id) {
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getapp', {appId: id}, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setApp(RS)
    }
  }

  const handleEditApp = async () => {
    console.log("handleEditApp app", app)
    setIsDisabledButton(true)
    if (auth && auth.user) {
      const appNew = {
        ...app,
        updateTime: String(new Date(Date.now()).toLocaleString()),
        mode: 'simple'
      }
      const PostParams = {name: appNew.name, _id: appNew._id, teamId: appNew.teamId, intro: appNew.intro, avatar: appNew.avatar, type: appNew.type, flowGroup: appNew.flowGroup, permission: appNew.permission, data: appNew}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/editapp', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      setIsDisabledButton(false)
      if(FormSubmit?.status == "ok") {
          toast.success(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
      }
      else {
          toast.error(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          if(FormSubmit && FormSubmit.msg=='Token is invalid') {
            CheckPermission(auth, router, true)
          }
      }
    }
  }

  const handleDeleteApp = async () => {
    console.log("handleEditApp app", app)
    setIsDisabledButton(true)
    if (auth && auth.user) {
      const PostParams = {appId: app._id}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/deleteapp', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      setIsDisabledButton(false)
      if(FormSubmit?.status == "ok") {
          toast.success(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          router.push('/app/my')
      }
      else {
          toast.error(t(FormSubmit.msg) as string, { duration: 4000, position: 'top-center' })
          if(FormSubmit && FormSubmit.msg=='Token is invalid') {
            CheckPermission(auth, router, true)
          }
      }
    }
  }

  useEffect(() => {
    if(id) {
      getMyApp(String(id))  
    }
  }, [refreshChatCounter, id])

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {auth.user && auth.user.email && app && app._id ?
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
        {app?._id?
        <LeftApp app={app} hidden={false} menuid={menuid}/>
        :
        null
        }
        
        {menuid == 'edit' && app?._id?
        <Fragment>
          <SimpleEdit app={app} setApp={setApp} handleEditApp={handleEditApp} handleDeleteApp={handleDeleteApp} isDisabledButton={isDisabledButton} deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen}/>
          <ChatIndex app={app} />
        </Fragment>
        :
        null
        }

        {menuid == 'publish' && app?._id?
        <Fragment>
          <PublishApp appId={app?._id} />
        </Fragment>
        :
        null
        }

        {menuid == 'chatlog' && app?._id?
        <Fragment>
          <ChatlogApp appId={app?._id} />
        </Fragment>
        :
        null
        }

        {menuid == 'chat' && app?._id?
        <Fragment>
          <ChatIndex app={app} />
        </Fragment>
        :
        null
        }

      </Box>
      :
      null
      }
      {auth.user && auth.user.email && app && !app._id ?
      <IdNotExist id={id} module={'Ai Chat Module For App && User'}/>
      :
      null
      }
    </Fragment>
  )
}

export default EditApp

