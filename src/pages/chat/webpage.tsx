// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Types
import { StatusObjType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import WebChatLeft from 'src/views/form/WebChatLeft'

import WebChatContent from 'src/views/chat/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import {
  ChatWebPageInit,
  ChatWebPageInput,
  ChatWebPageOutput,
  GetWebChatList,
  CheckPermission
} from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const AppChat = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)

  const [webChat, setWebChat] = useState<any>([])
  const [webChatId, setWebChatId] = useState<number>(0)
  const [webChatName, setWebChatName] = useState<string>('')

  const WebChatList: any[] = GetWebChatList()

  useEffect(() => {
    // 当组件加载时获取聊天列表
    setWebChat(WebChatList)
    setWebChatId(WebChatList[0].id)
    setWebChatName(WebChatList[0].name)

    // 清理函数：组件卸载时执行
    return () => {
      // 清空聊天内容和相关状态
      setStore(null)
      setWebChat([])
    }
  }, [])

  const getChatLogList = async function (webChatId: number | string) {
    if (auth && auth.user) {
      const RS = await axios
        .get(authConfig.backEndApiChatBook + '/api/chatlog/' + webChatId + '/' + auth.user.id + '/0/90', {
          headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }
        })
        .then(res => res.data)
      if (RS['data']) {
        const ChatWebPageInitList = ChatWebPageInit(RS['data'].reverse())
        console.log('ChatWebPageInitList**************', ChatWebPageInitList)
        const selectedChat = {
          chat: {
            id: 1,
            userId: auth.user.id,
            unseenMsgs: 0,
            chat: ChatWebPageInitList
          }
        }
        const storeInit = {
          chats: [],
          userProfile: {
            id: auth.user.id,
            avatar: '/images/avatars/1.png',
            fullName: 'Current User'
          },
          selectedChat: selectedChat
        }
        setStore(storeInit)
      }
    }
  }

  const setActiveId = function (Id: number, Name: string) {
    setWebChatId(Id)
    setWebChatName(Name)
    getChatLogList(Id)
    setRefreshChatCounter(refreshChatCounter + 1)
  }

  // ** States
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [lastMessage, setLastMessage] = useState('')
  const lastChat = {
    message: lastMessage,
    time: String(Date.now()),
    senderId: 999999,
    webChatId: 0,
    feedback: {
      isSent: true,
      isDelivered: false,
      isSeen: false
    }
  }

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    if (auth.user && auth.user.id) {
      const ChatChatText = window.localStorage.getItem('ChatWebPage')
      const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
      if (lastMessage && lastMessage != '') {
        ChatChatList.push(lastChat)
      }
      const selectedChat = {
        chat: {
          id: auth.user.id,
          userId: auth.user.id,
          unseenMsgs: 0,
          chat: ChatChatList
        }
      }
      const storeInit = {
        chats: [],
        userProfile: {
          id: auth.user.id,
          avatar: '/images/avatars/1.png',
          fullName: 'Current User'
        },
        selectedChat: selectedChat
      }
      setStore(storeInit)
    } else {
      setSendButtonDisable(true)
      setSendButtonLoading(false)
      setSendButtonText(t('Login first') as string)
    }
  }, [refreshChatCounter, lastMessage, auth])

  useEffect(() => {
    const ChatChatNameListData: string[] = GetWebChatList()
    if (ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t('Send') as string)
    setSendInputText(t('Type your message here...') as string)
  }, [])

  const sendMsg = async (Obj: any) => {
    if (auth.user && auth.user.token) {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t('Sending') as string)
      setSendInputText(t('Generating the answer...') as string)
      ChatWebPageInput(Obj.message, auth.user.id, webChatId)
      setRefreshChatCounter(refreshChatCounter + 1)
      const ChatChatOutputStatus = await ChatWebPageOutput(
        Obj.message,
        auth.user.token,
        auth.user.id,
        webChatId,
        setLastMessage
      )
      if (ChatChatOutputStatus) {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t('Send') as string)
        setSendInputText(t('Type your message here...') as string)
      }
    }
  }

  // ** Vars
  const { skin } = settings
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  return (
    <Fragment>
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <WebChatLeft
          webChat={webChat}
          setActiveId={setActiveId}
          hidden={false}
          webChatId={webChatId}
          webChatName={webChatName}
        />

        <WebChatContent
          store={store}
          hidden={hidden}
          sendMsg={sendMsg}
          mdAbove={mdAbove}
          statusObj={statusObj}
          sendButtonDisable={sendButtonDisable}
          sendButtonLoading={sendButtonLoading}
          sendButtonText={sendButtonText}
          sendInputText={sendInputText}
          chatId={webChatId}
          chatName={webChatName}
          email={auth?.user?.email}
        />
      </Box>
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
