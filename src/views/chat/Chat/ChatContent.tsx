// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/chat/Knowledge/SendMsgForm'
import OptionsMenu from 'src/@core/components/option-menu'

import { GetAllLLMById } from 'src/functions/ChatBook'

const ChatContent = (props: any) => {
  // ** Props
  const {
    store,
    hidden,
    sendMsg,
    mdAbove,
    sendButtonDisable,
    sendButtonText,
    sendInputText,
    chatId,
    chatName
  } = props

  const LLMS = GetAllLLMById(chatId)

  const renderContent = () => {
          return (
            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                height: '100%',
                backgroundColor: 'action.hover'
              }}
            >
              <Box
                sx={{
                  py: 3,
                  px: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
              >
                {LLMS && LLMS[0] && LLMS[0].avatar ?                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {mdAbove ? null : (
                    <IconButton sx={{ mr: 2 }}>
                      <Icon icon='mdi:menu' />
                    </IconButton>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                    <Badge
                      overlap='circular'
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      sx={{ mr: 3 }}
                      badgeContent={
                        <Box
                          component='span'
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            color: `primary.main`,
                            boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                            backgroundColor: `primary.main`
                          }}
                        />
                      }
                    >
                      <MuiAvatar
                        src={LLMS[0].avatar}
                        alt={chatName}
                        sx={{ width: '2.375rem', height: '2.375rem' }}
                      />
                    </Badge>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {chatName}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {LLMS[0].summary}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                :
                null
                }

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {mdAbove ? (
                    <Fragment>
                    </Fragment>
                  ) : null}
                  <OptionsMenu
                    menuProps={{ sx: { mt: 2 } }}
                    icon={<Icon icon='mdi:dots-vertical' fontSize='1.25rem' />}
                    iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                    options={['View Contact', 'Mute Notifications', 'Block Contact', 'Clear Chat', 'Report']}
                  />
                </Box>
              </Box>

              {store && store.selectedChat && store.userProfile ? (
                <ChatLog hidden={hidden} data={{ ...store.selectedChat, userContact: store.userProfile }} chatId={chatId} chatName={chatName} LLMS={LLMS} />
              ) : null}

              <SendMsgForm store={store} sendMsg={sendMsg} sendButtonDisable={sendButtonDisable} sendButtonText={sendButtonText} sendInputText={sendInputText}/>

            </Box>
          )
  }

  return renderContent()
}

export default ChatContent
