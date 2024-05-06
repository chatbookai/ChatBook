// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Components Import
import ChatLog from './ChatLog'
import { useTranslation } from 'react-i18next'
import SendMsgForm from 'src/views/app/chat/SendMsgForm'

const ChatContent = (props: any) => {
  // ** Props
  const {
    store,
    hidden,
    sendMsg,
    sendButtonDisable,
    sendButtonLoading,
    sendButtonText,
    sendInputText,
    chatId,
    chatName,
    ClearButtonClick,
    historyCounter,
    app,
    GetSystemPromptFromAppValue,
    handleDeleteOneChatLogById,
    userType,
    GetModelFromAppValue
  } = props

  const { t } = useTranslation()

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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center'}} >
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
                        src={app.avatar}
                        alt={chatName}
                        sx={{ width: '2rem', height: '2rem' }}
                      />
                    </Badge>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {chatName}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'primary.secondary', marginLeft: '8px' }}>
                        {GetModelFromAppValue}
                      </Typography>
                    </Box>

                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button size="small" onClick={()=>ClearButtonClick()} disabled={historyCounter==0?true:false}>{t('Clear')}({historyCounter})</Button>
                </Box>
              </Box>

              {store && store.selectedChat && store.userProfile ? 
                <ChatLog hidden={hidden} data={{ ...store.selectedChat, userContact: store.userProfile }} chatId={chatId} chatName={chatName} app={app} rowInMsg={rowInMsg} maxRows={maxRows} sendButtonDisable={sendButtonDisable} GetSystemPromptFromAppValue={GetSystemPromptFromAppValue} handleDeleteOneChatLogById={handleDeleteOneChatLogById} sendMsg={sendMsg} store={store} userType={userType}/>
              : 
                <ChatLog hidden={hidden} data={{}} chatId={chatId} chatName={chatName} app={app} rowInMsg={rowInMsg} maxRows={maxRows} sendButtonDisable={sendButtonDisable} GetSystemPromptFromAppValue={GetSystemPromptFromAppValue} handleDeleteOneChatLogById={handleDeleteOneChatLogById} sendMsg={sendMsg} store={store} userType={userType}/>
              }

              <SendMsgForm store={store} sendMsg={sendMsg} sendButtonDisable={sendButtonDisable} sendButtonLoading={sendButtonLoading} sendButtonText={sendButtonText} sendInputText={sendInputText} rowInMsg={rowInMsg} handleSetRowInMsg={handleSetRowInMsg} maxRows={maxRows} />

            </Box>
          )
  }

  return renderContent()
}

export default ChatContent
