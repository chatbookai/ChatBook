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
import LLMSLeft from 'src/views/form/LLMSLeft'
import ChatContent from 'src/views/chat/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetAllLLMS, ChatChatInit, ChatChatNameList, ChatChatInput, ChatChatOutput, CheckPermission  } from 'src/functions/ChatBook'

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
    CheckPermission(auth, router)
  }, [])
  
  
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [llms, setLlms] = useState<any>([])
  const [chatId, setChatId] = useState<number | string>(-1)
  const [chatName, setChatName] = useState<string>("")

  const AllLLMS: any[] = GetAllLLMS()

  useEffect(() => {
    setLlms(AllLLMS)
    setChatId(AllLLMS[0].id)
    setChatName(AllLLMS[0].name)
    getChatLogList(AllLLMS[0].id)
    console.log("AllLLMS", AllLLMS)
  }, [])

  const getChatLogList = async function (knowledgeId: number | string) {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/chatlog/' + knowledgeId + '/' + auth.user.id + '/0/90', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS['data'])  {
        const ChatChatInitList = ChatChatInit(RS['data'].reverse())
        console.log("ChatChatInitList**************", ChatChatInitList)
        const selectedChat = {
          "chat": {
              "id": 1,
              "userId": auth.user.id,
              "unseenMsgs": 0,
              "chat": ChatChatInitList
          }
        }
        const storeInit = {
          "chats": [],
          "userProfile": {
              "id": auth.user.id,
              "avatar": "/images/avatars/1.png",
              "fullName": "Current User",
          },
          "selectedChat": selectedChat
        }
        setStore(storeInit)
      }
    }
  }

  const setActiveId = function (Id: string, Name: string) {
    setChatId(Id)
    setChatName(Name)
    getChatLogList(Id)
    setRefreshChatCounter(refreshChatCounter + 1)
  }

  // ** States
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [lastMessage, setLastMessage] = useState("")
  const lastChat = {
    "message": lastMessage,
    "time": String(Date.now()),
    "senderId": 999999,
    "knowledgeId": 0,
    "feedback": {
        "isSent": true,
        "isDelivered": false,
        "isSeen": false
    }
  }

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    if(auth.user)   {
      const ChatChatText = window.localStorage.getItem("ChatChat")      
      const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
      if(lastMessage && lastMessage!="") {
        ChatChatList.push(lastChat)
      }
      const selectedChat = {
        "chat": {
            "id": auth.user.id,
            "userId": auth.user.id,
            "unseenMsgs": 0,
            "chat": ChatChatList
        }
      }
      const storeInit = {
        "chats": [],
        "userProfile": {
            "id": auth.user.id,
            "avatar": "/images/avatars/1.png",
            "fullName": "Current User",
        },
        "selectedChat": selectedChat
      }
      setStore(storeInit)
    }
  }, [refreshChatCounter, lastMessage, auth])

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Type your message here...") as string)    
  }, [])


  const sendMsg = async (Obj: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Generating the answer...") as string)
      ChatChatInput(Obj.message, auth.user.id)
      setRefreshChatCounter(refreshChatCounter + 1)
      const ChatChatOutputStatus = await ChatChatOutput(Obj.message, auth.user.token, auth.user.id, chatId, setLastMessage)
      if(ChatChatOutputStatus) {
        setSendButtonDisable(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Type your message here...") as string)  
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
      {auth.user && auth.user.email ?
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
      <LLMSLeft
        llms={llms}
        setActiveId={setActiveId}
        hidden={false}
        chatId={chatId}
        chatName={chatName}
      />
      <ChatContent
        store={store}
        hidden={hidden}
        sendMsg={sendMsg}
        mdAbove={mdAbove}
        statusObj={statusObj}
        sendButtonDisable={sendButtonDisable}
        sendButtonText={sendButtonText}
        sendInputText={sendInputText}
        chatId={chatId}
        chatName={chatName}
      />
      </Box>
      :
      null
      }
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
