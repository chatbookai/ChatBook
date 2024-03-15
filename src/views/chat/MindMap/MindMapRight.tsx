// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/chat/Flow/SendMsgForm'

import { GetAllLLMById } from 'src/functions/ChatBook'

const FlowRight = (props: any) => {
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
    lastQuestion,
    disabledButton,
    setDisabledButton,
    downloadPng
  } = props

  const LLMS = GetAllLLMById(chatId)

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
                width: '550px',
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
                  {mdAbove ? null : (
                    <IconButton sx={{ mr: 2 }}>
                      <Icon icon='mdi:menu' />
                    </IconButton>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {chatName}
                        <Button onClick={()=>{downloadPng(lastQuestion)}} size="small" disabled={sendButtonDisable}>PNG</Button>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {store && store.selectedChat && store.userProfile ? 
                <ChatLog hidden={hidden} data={{ ...store.selectedChat, userContact: store.userProfile }} chatId={chatId} chatName={chatName} LLMS={LLMS} rowInMsg={rowInMsg} maxRows={maxRows} sendMsg={sendMsg} lastQuestion={lastQuestion} disabledButton={disabledButton} setDisabledButton={setDisabledButton}/>
              : 
                <ChatLog hidden={hidden} data={{}} chatId={chatId} chatName={chatName} LLMS={LLMS} rowInMsg={rowInMsg} maxRows={maxRows} sendMsg={sendMsg} lastQuestion={lastQuestion} disabledButton={disabledButton} setDisabledButton={setDisabledButton}/>
                }

              <SendMsgForm store={store} sendMsg={sendMsg} sendButtonDisable={sendButtonDisable} sendButtonLoading={sendButtonLoading} sendButtonText={sendButtonText} sendInputText={sendInputText} rowInMsg={rowInMsg} handleSetRowInMsg={handleSetRowInMsg} maxRows={maxRows} />

            </Box>
          )
  }

  return renderContent()
}

export default FlowRight
