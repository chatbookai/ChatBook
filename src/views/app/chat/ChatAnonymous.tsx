// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import ChatIndex from 'src/views/app/chat/ChatIndex'
import IdNotExist from 'src/pages/404IdNotExist'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

const ChatAnonymous = () => {
    // ** States
    const [app, setApp] = useState<any>(null)
  
    // ** Hooks
    const { i18n } = useTranslation()
    const theme = useTheme()
    const { settings } = useSettings()
    const auth = useAuth()
    const router = useRouter()
    const { id } = router.query
    useEffect(() => {
      CheckPermission(auth, router, false)
      i18n.changeLanguage('zh')
    }, [])

    const getMyApp = async function (id: string) {
        if (auth && auth.user && id) {
          const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getappbypublishid/', {publishId: id}, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
          setApp(RS)
        }
    }

    useEffect(() => {
        if(id) {
          getMyApp(String(id))  
        }
    }, [id])

    
    const { skin } = settings

    return (
        <Fragment>
          <Box
            className='app-chat'
            sx={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.paper',
              boxShadow: skin === 'bordered' ? 0 : 6,
              ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
            }}
          >
            {app && app.id ?
            <ChatIndex app={app} />
            :
            null
            }
            {app && !app.id ?
            <IdNotExist id={id} module={'Ai Chat Module For Public'}/>
            :
            null
            }
          </Box>
        </Fragment>
    )
}

export default ChatAnonymous