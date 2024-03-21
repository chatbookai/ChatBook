// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/chat/Knowledge/SendMsgForm'

import { GetAllLLMById } from 'src/functions/ChatBook'

const ChatContent = (props: any) => {
  // ** Props
  const {
    store,
    hidden,
    sendMsg,
    mdAbove,
    sendButtonDisable,
    sendButtonLoading,
    sendButtonText,
    sendInputText,
    chatId,
    chatName,
    ClearButtonClick,
    ClearButtonName,
    historyCounter,
    agent
  } = props

  const [rowInMsg, setRowInMsg] = useState<number>(1)
  
  const maxRows = 8

  const handleSetRowInMsg = (row: number) => {
    setRowInMsg(row)
  }

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
                {agent && agent.title ?                
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
                        src={agent.avatar? agent.avatar : '/images/avatars/1.png'}
                        alt={chatName}
                        sx={{ width: '2.375rem', height: '2.375rem' }}
                      />
                    </Badge>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {chatName}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        {agent.model}
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
                  <Button onClick={()=>ClearButtonClick()} disabled={historyCounter==0?true:false}>{ClearButtonName}({historyCounter})</Button>
                </Box>
              </Box>

              {store && store.selectedChat && store.userProfile ? 
                <ChatLog hidden={hidden} data={{ ...store.selectedChat, userContact: store.userProfile }} chatId={chatId} chatName={chatName} agent={agent} rowInMsg={rowInMsg} maxRows={maxRows} />
              : 
                <ChatLog hidden={hidden} data={{}} chatId={chatId} chatName={chatName} agent={agent} rowInMsg={rowInMsg} maxRows={maxRows} />
                }

              <SendMsgForm store={store} sendMsg={sendMsg} sendButtonDisable={sendButtonDisable} sendButtonLoading={sendButtonLoading} sendButtonText={sendButtonText} sendInputText={sendInputText} rowInMsg={rowInMsg} handleSetRowInMsg={handleSetRowInMsg} maxRows={maxRows} />

            </Box>
          )
  }

  return renderContent()
}

export default ChatContent
