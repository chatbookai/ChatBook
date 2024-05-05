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
import { getAnonymousUserId } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'

const ChatAnonymous = () => {
    // ** States
    const [app, setApp] = useState<any>(null)
    const [show, setShow] = useState<boolean>(true)

    // ** Hooks
    const { t, i18n } = useTranslation()
    const theme = useTheme()
    const { settings } = useSettings()
    const router = useRouter()
    const { id } = router.query

    const getMyApp = async function (id: string, anonymousUserId: string) {
      if (id && id.length == 32 && anonymousUserId && anonymousUserId.length == 32) {
        const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getappbypublishid/', {publishId: id, userType: 'Anonymous'}, { headers: { Authorization: anonymousUserId, 'Content-Type': 'application/json'} }).then(res=>res.data)
        if(RS && RS.PublishApp && RS.PublishApp.appId) {
          i18n.changeLanguage(RS.PublishApp.language)
          setShow(false)
          setApp(RS)
        }
      }
    }

    useEffect(() => {
      if(id && id.length == 32) {
        const anonymousUserId: string = getAnonymousUserId()
        getMyApp(String(id), anonymousUserId)  
        console.log("anonymousUserId id", id, anonymousUserId)
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
            <ChatIndex app={app} userType={'Anonymous'}/>
            :
            null
            }
            {app && !app.id ?
            <IdNotExist id={id} module={'Ai Chat Module For Public'}/>
            :
            null
            }
            {!app ?
            <Dialog
              open={show}
              onClose={() => setShow(false)}
            >
              <DialogContent sx={{ position: 'relative' }}>
                <Container>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sx={{}}>
                      <Box sx={{ ml: 6, display: 'flex', alignItems: 'center', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                        <CircularProgress sx={{ mb: 4 }} />
                        <Typography>{t('Loading') as string}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </DialogContent>
            </Dialog>
            :
            null}
          </Box>
        </Fragment>
    )
}

export default ChatAnonymous