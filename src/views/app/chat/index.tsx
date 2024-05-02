// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

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

const Chat = (props: any) => {
  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [app, setApp] = useState<any>(null)
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

  const getMyApp = async function (id: string) {
    if (auth && auth.user && id) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/getapp/' + id, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setApp(RS)
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
      {auth.user && auth.user.email && app ?
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
        <ChatIndex app={app} />

      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default Chat

