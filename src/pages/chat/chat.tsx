// ** React Imports
import { useEffect, useState } from 'react'

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

import { GetAllLLMS, ChatKnowledgeInit, ChatChatNameList, ChatChatInput, ChatChatOutput  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [llms, setLlms] = useState<any>([])
  const [chatId, setChatId] = useState<number | string>(-1)
  const [chatName, setChatName] = useState<string>("")
  const userId = 1

  const AllLLMS: any[] = GetAllLLMS()

  useEffect(() => {
    setLlms(AllLLMS)
    setChatId(AllLLMS[0].id)
    setChatName(AllLLMS[0].name)
    getChatLogList(AllLLMS[0].id)
    console.log("AllLLMS", AllLLMS)
  }, [])

  const getChatLogList = async function (knowledgeId: number | string) {
    const RS = await axios.get('/api/chatlog/' + knowledgeId + '/' + userId + '/0/90').then(res=>res.data)
    const ChatKnowledgeInitList = ChatKnowledgeInit(RS['data'].reverse())
    console.log("ChatKnowledgeInitList", ChatKnowledgeInitList)
    const selectedChat = {
      "chat": {
          "id": 1,
          "userId": 1,
          "unseenMsgs": 0,
          "chat": ChatKnowledgeInitList
      }
    }
    const storeInit = {
      "chats": [],
      "userProfile": {
          "id": userId,
          "avatar": "/images/avatars/1.png",
          "fullName": "Current User",
      },
      "selectedChat": selectedChat
    }
    setStore(storeInit)
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
    const ChatChatText = window.localStorage.getItem("ChatChat")      
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    if(lastMessage && lastMessage!="") {
      ChatChatList.push(lastChat)
    }
    const selectedChat = {
      "chat": {
          "id": 1,
          "userId": 1,
          "unseenMsgs": 0,
          "chat": ChatChatList
      }
    }
    const storeInit = {
      "chats": [],
      "userProfile": {
          "id": userId,
          "avatar": "/images/avatars/1.png",
          "fullName": "Current User",
      },
      "selectedChat": selectedChat
    }
    setStore(storeInit)
  }, [refreshChatCounter, lastMessage])

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Type your message here...") as string)    
  }, [])


  const sendMsg = async (Obj: any) => {
    setSendButtonDisable(true)
    setSendButtonText(t("Sending") as string)
    setSendInputText(t("Generating the answer...") as string)
    ChatChatInput(Obj.message, userId, chatId)
    setRefreshChatCounter(refreshChatCounter + 1)
    const ChatChatOutputStatus = await ChatChatOutput(Obj.message, userId, chatId, setLastMessage)
    if(ChatChatOutputStatus) {
      setSendButtonDisable(false)
      setRefreshChatCounter(refreshChatCounter + 2)
      setSendButtonText(t("Send") as string)
      setSendInputText(t("Type your message here...") as string)  
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
  )
}

AppChat.contentHeightFixed = true

export default AppChat
