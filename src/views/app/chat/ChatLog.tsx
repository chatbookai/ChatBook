// ** React Imports
import { useRef, useEffect, Ref, ReactNode, Fragment, useState } from 'react'
import { saveAs } from 'file-saver';

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import CardMedia from '@mui/material/CardMedia'
import Link from 'next/link'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'

import ChatContextPreview from 'src/views/app/chat/ChatContextPreview'

import { ChatAiAudioV1 } from 'src/functions/ChatBook'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import {
  MessageType,
  MsgFeedbackType,
  ChatLogChatType,
  MessageGroupType,
  FormattedChatsType
} from 'src/types/apps/chatTypes'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(3, 5, 3, 3)
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const TextToSpeech = ({ text, AudioType, app }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFilesCache, setAudioFilesCache] = useState<any>({})

  const [audio] = useState(new Audio());
  const synth = window.speechSynthesis;
  const { t } = useTranslation()
  const auth = useAuth()

  const beginPlaying = async () => {
    if (!isPlaying && AudioType == 'Broswer') {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      synth.cancel();
      synth.speak(utterance);
    }

    if (!isPlaying && AudioType != 'Broswer' && auth && auth.user && auth.user.token) {
      setIsPlaying(true);
      if(audioFilesCache[text] == null)    {
        const ChatAiAudioV1Status: any = await ChatAiAudioV1(text, auth.user.token, AudioType, app._id)
        console.log("ChatAiAudioV1Status", ChatAiAudioV1Status)
        if(ChatAiAudioV1Status && ChatAiAudioV1Status.type == 'audio' && ChatAiAudioV1Status.status == 'OK') {
          setAudioFilesCache((prevState: any)=>{
            const AudioFilesCache = { ...prevState }
            AudioFilesCache[text] = ChatAiAudioV1Status.ShortFileName
            return AudioFilesCache
          })
          // Test URL `http://localhost:1988/api/audio/1706839115494-336161094-TTS-1`
          audio.src = authConfig.backEndApiChatBook + '/api/audio/' + ChatAiAudioV1Status.ShortFileName
          console.log("audio.src realtime get audio", audio.src)
          audio.play();
        }
      }
      else {
        audio.src = authConfig.backEndApiChatBook + '/api/audio/' + audioFilesCache[text]
        console.log("audio.src using cache", audio.src)
        audio.play();
      }
    }
  };

  const stopPlaying = () => {
    if (isPlaying && AudioType == 'Broswer') {
      setIsPlaying(false);
      synth.cancel();
    }
    if (isPlaying && AudioType != 'Broswer') {
      setIsPlaying(false);
      audio.pause();
      audio.currentTime = 0;
    }
  };

  audio.onended = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      {isPlaying ?
      (
        <Tooltip title={t('ReadAloudContent')}>
          <IconButton aria-label='capture screenshot' color='error' size='small' onClick={stopPlaying} >
            <Icon icon='material-symbols:stop-circle-outline' fontSize='inherit' />
          </IconButton>
        </Tooltip>
      )
      :
      <Tooltip title={t('ReadAloudContent')}>
        <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={beginPlaying} >
          <Icon icon='wpf:speaker' fontSize='inherit' />
        </IconButton>
      </Tooltip>
      }
    </div>
  );
};

const ChatLog = (props: any) => {
  // ** Props
  const { t } = useTranslation()
  const { data, hidden, chatName, app, rowInMsg, maxRows, sendButtonDisable, GetSystemPromptFromAppValue, handleDeleteOneChatLogById } = props

  const [contextPreviewOpen, setContextPreviewOpen] = useState<boolean>(false)
  const [contextPreviewData, setContextPreviewData] = useState<any[]>([])

  // ** Ref
  const chatArea = useRef(null)

  console.log("rowInMsg IN ChatLog", rowInMsg)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = Number.MAX_SAFE_INTEGER
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = Number.MAX_SAFE_INTEGER
      }
    }
  }

  const handleDownload = (DownloadUrl: string, FileName: string) => {
    fetch(DownloadUrl)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, FileName);
      })
      .catch(error => {
        console.log('Error downloading file:', error);
      });
  };

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: MessageType[] | [] = []
    if (data.chat) {
      chatLog = data.chat.chat
    }

    const formattedChatLog: FormattedChatsType[] = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : 11
    let msgGroup: MessageGroupType = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg: MessageType, index: number) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          time: msg.time,
          msg: msg.message,
          responseTime: msg.responseTime,
          chatlogId: msg.chatlogId,
          history: msg.history,
          feedback: msg.feedback,
          question: ''
        })
      } else {
        chatMessageSenderId = msg.senderId

        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              time: msg.time,
              msg: msg.message,
              responseTime: msg.responseTime,
              chatlogId: msg.chatlogId,
              history: msg.history,
              feedback: msg.feedback,
              question: msg.question
            }
          ]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  const renderMsgFeedback = (isSender: boolean, feedback: MsgFeedbackType) => {
    if (isSender) {
      if (feedback.isSent && !feedback.isDelivered) {
        return (
          <Box component='span' sx={{ display: 'inline-flex', '& svg': { mr: 2, color: 'text.secondary' } }}>
            <Icon icon='mdi:check' fontSize='1rem' />
          </Box>
        )
      } else if (feedback.isSent && feedback.isDelivered) {
        return (
          <Box
            component='span'
            sx={{
              display: 'inline-flex',
              '& svg': { mr: 2, color: feedback.isSeen ? 'success.main' : 'text.secondary' }
            }}
          >
            <Icon icon='mdi:check-all' fontSize='1rem' />
          </Box>
        )
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    if (data && data.chat && data.chat.chat.length) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])


  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item: FormattedChatsType, index: number, ChatItemMsgList: any[]) => {
      const isSender = item.senderId === data.userContact.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: index !== formattedChatData().length - 1 ? 4 : undefined
          }}
        >
          {isSender ?
          <Box display="flex" alignItems="center" justifyContent="right" borderRadius="8px" p={0} mb={1} >
            <ToggleButtonGroup exclusive value={'left'} size='small' aria-label='text alignment'>
              <Tooltip title={t('Copy')}>
                <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                  navigator.clipboard.writeText(item.messages[0].msg);
                  toast.success(t('Copied success') as string, { duration: 1000 })
                }}>
                  <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Refresh')}>
                <IconButton aria-label='capture screenshot' color='secondary' size='small'>
                  <Icon icon='mdi:refresh' fontSize='inherit' />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Delete')}>
                <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                  handleDeleteOneChatLogById(item.messages[0].chatlogId)
                }}>
                  <Icon icon='mdi:trash-outline' fontSize='inherit' />
                </IconButton>
              </Tooltip>
            </ToggleButtonGroup>
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
              }}
              {...{
                src: data.userContact.avatar,
                alt: data.userContact.fullName
              }}
            >
              {app.name}
            </CustomAvatar>
          </Box>
          :
          <Box display="flex" alignItems="center" justifyContent="left" borderRadius="8px" p={0} mb={1} >
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
              }}
              {...{
                src: app.avatar? app.avatar : '/images/avatars/1.png',
                alt: chatName
              }}
            >
              {app.name}
            </CustomAvatar>
            {sendButtonDisable ?
            <Fragment>
              
              <Typography
                sx={{
                  boxShadow: 1,
                  borderRadius: 0.5,
                  width: 'fit-content',
                  fontSize: '0.875rem',
                  p: theme => theme.spacing(0.5, 2, 0.5, 2),
                  ml: 1,
                  color: 'text.primary',
                  backgroundColor: 'background.paper'
                }}
                >
                  <CircularProgress color='success' size={10} sx={{mr: 1}}/>
                  {t('AI Chat')}
                </Typography>
            </Fragment>
            :
            null
            }
            {sendButtonDisable == false && index > 0 ?
            <ToggleButtonGroup exclusive value={'left'} size='small' aria-label='text alignment'>
              <Tooltip title={t('Copy')}>
                <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                  navigator.clipboard.writeText(item.messages[0].msg);
                  toast.success(t('Copied success') as string, { duration: 1000 })
                }}>
                  <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                </IconButton>
              </Tooltip>
              <TextToSpeech text={item.messages[0].msg} AudioType='alloy' app={app}/>
            </ToggleButtonGroup>
            :
            null
            }

          </Box>
          }

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '100%', '100%'] }}>
            {item.messages.map((chat: ChatLogChatType, ChatIndex: number, ChatMsgList: any[]) => {
              let ChatMsgType = 'Chat'
              let ChatMsgContent: any
              if(chat.msg.includes('"type":"image"')) {
                ChatMsgType = 'Image'
                ChatMsgContent = JSON.parse(chat.msg)
              }
              if(chat.msg.includes('"type":"audio"')) {
                ChatMsgType = 'Audio'
                ChatMsgContent = JSON.parse(chat.msg)
              }

              //console.log("chatchatchat",chat)

              return (
                <Box key={ChatIndex} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                    {ChatMsgType == "Chat" ?
                      <div>
                        <Typography
                        sx={{
                          boxShadow: 1,
                          borderRadius: 1,
                          width: 'fit-content',
                          fontSize: '0.875rem',
                          p: theme => theme.spacing(0.5, 2, 0.5, 3),
                          ml: isSender ? 'auto' : undefined,
                          borderTopLeftRadius: !isSender ? 0 : undefined,
                          borderTopRightRadius: isSender ? 0 : undefined,
                          color: isSender ? 'common.white' : 'text.primary',
                          backgroundColor: isSender ? 'primary.main' : 'background.paper'
                        }}
                        >
                          <ReactMarkdown>{chat.msg.replace('\n', '  \n')}</ReactMarkdown>
                        </Typography>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            {renderMsgFeedback(isSender, chat.feedback)}
                            {!isSender && Number(chat.responseTime) > 0 && ( (index + 1 == ChatItemMsgList.length && !sendButtonDisable) || (index + 1 < ChatItemMsgList.length))?
                            <Box display="flex" alignItems="center" justifyContent="left" borderRadius="8px" p={0} mb={1} >
                                <Tooltip title={t('ClickViewContentPreview')}>
                                  <Button color='success' size="small" style={{ whiteSpace: 'nowrap' }} onClick={()=>{
                                    const historyAll: any[] = [...chat.history]
                                    historyAll.push([chat.question, chat.msg])
                                    setContextPreviewOpen(true)
                                    setContextPreviewData(historyAll)
                                  }}>
                                    {t('ContextCount')}({(chat.history.length+1)*2+1})
                                    </Button>
                                </Tooltip>
                                <Tooltip title={t('ModuleRunningTime')}>
                                  <Button color='error' size="small" style={{ whiteSpace: 'nowrap' }} disableTouchRipple disableRipple>{chat.responseTime}S</Button>
                                </Tooltip>
                                <Tooltip title={t('ClickViewDetailFlow')}>
                                  <Button color='warning' size="small" style={{ whiteSpace: 'nowrap' }}>{t('ViewDetail')}</Button>
                                </Tooltip>
                                <Button color='info' size="small" disabled style={{ whiteSpace: 'nowrap' }}>
                                {chat.time ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : null}
                                </Button>
                            </Box>
                            :
                            null
                            }
                          </Box>
                      </div>
                      :
                      null
                    }
                    {ChatMsgType == "Image" && ChatMsgContent && ChatMsgContent.ShortFileName ?
                      <div>
                        <LinkStyled target='_blank' href={authConfig.backEndApiChatBook + '/api/image/' + ChatMsgContent.ShortFileName}>
                          <CardMedia image={authConfig.backEndApiChatBook + '/api/image/' + ChatMsgContent.ShortFileName} sx={{ mt: 1, width: '500px', height: '500px', borderRadius: '5px' }}/>
                        </LinkStyled>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                              {ChatMsgContent.ShortFileName ?
                              <LinkStyled onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/image/' + ChatMsgContent.ShortFileName, ChatMsgContent.ShortFileName + '.png')} href={'#'} sx={{ml: 1}}>
                                Download
                              </LinkStyled>
                              :
                              null
                              }
                            </Typography>
                          </Box>
                      </div>
                      :
                      null
                    }
                    {ChatMsgType == "Audio" && ChatMsgContent && ChatMsgContent.ShortFileName ?
                      <div>
                        <LinkStyled target='_blank' href={authConfig.backEndApiChatBook + '/api/audio/' + ChatMsgContent.ShortFileName}>
                          <CardMedia component="audio" controls src={authConfig.backEndApiChatBook + '/api/audio/' + ChatMsgContent.ShortFileName} sx={{ mt: 1, width: '360px', borderRadius: '5px' }}/>
                        </LinkStyled>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                              {ChatMsgContent.ShortFileName ?
                              <LinkStyled onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/audio/' + ChatMsgContent.ShortFileName, ChatMsgContent.ShortFileName + '.mp3')} href={'#'} sx={{ml: 1}}>
                                Download
                              </LinkStyled>
                              :
                              null
                              }
                            </Typography>
                          </Box>
                      </div>
                      :
                      null
                    }
                </Box>
              )
            })}
          </Box>
          
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false, suppressScrollX: true }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  const inputMsgHeight = rowInMsg <= maxRows? rowInMsg * 1.25 : maxRows * 1.25

  return (
    <Fragment>
    <Box sx={{ height: `calc(100% - 6.2rem - ${inputMsgHeight}rem)` }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
    <ChatContextPreview contextPreviewOpen={contextPreviewOpen} setContextPreviewOpen={setContextPreviewOpen} contextPreviewData={contextPreviewData} GetSystemPromptFromAppValue={GetSystemPromptFromAppValue}/>
    </Fragment>
  )
}

export default ChatLog
