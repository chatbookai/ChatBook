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
import KnowledgeLeft from 'src/views/form/KnowledgeLeft'
import ChatContent from 'src/views/chat/Knowledge/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Axios Imports
import axios from 'axios'

import { ChatKnowledgeInit, ChatKnowledgeInput, ChatKnowledgeOutput } from 'src/functions/ChatBook'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [knowledge, setKnowledge] = useState<any>(null)
  const [knowledgeId, setKnowledgeId] = useState<number>(0)
  const [knowledgeName, setKnowledgeName] = useState<string>("")
  const userId = 1

  const getAllKnowledgeList = async function () {
    const RS = await axios.get('/api/knowledge/0/100').then(res=>res.data)
    setKnowledge(RS)
    if(RS && RS['data'] && RS['data'][0] && RS['data'][0].id && knowledgeId == 0) {
      setKnowledgeId(RS['data'][0].id)
      setKnowledgeName(RS['data'][0].name)
      getChatLogList(RS['data'][0].id)
    }
  }

  const getChatLogList = async function (knowledgeId: number) {
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

  const setActiveId = function (Id: number, Name: string) {
    setKnowledgeId(Id)
    setKnowledgeName(Name)
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
    const ChatKnowledgeText = window.localStorage.getItem("ChatKnowledge")      
    const ChatKnowledgeList = ChatKnowledgeText ? JSON.parse(ChatKnowledgeText) : []
    if(lastMessage && lastMessage!="") {
      ChatKnowledgeList.push(lastChat)
    }
    const selectedChat = {
      "chat": {
          "id": 1,
          "userId": 1,
          "unseenMsgs": 0,
          "chat": ChatKnowledgeList
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
    getAllKnowledgeList()  
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Type your message here...") as string)    
  }, [])

  const sendMsg = async (Obj: any) => {
    setSendButtonDisable(true)
    setSendButtonText(t("Sending") as string)
    setSendInputText(t("Generating the answer...") as string)
    ChatKnowledgeInput(Obj.message, userId, knowledgeId)
    setRefreshChatCounter(refreshChatCounter + 1)
    const ChatKnowledgeOutputStatus = await ChatKnowledgeOutput(Obj.message, userId, knowledgeId, setLastMessage)
    if(ChatKnowledgeOutputStatus) {
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
      <KnowledgeLeft
        knowledge={knowledge}
        setActiveId={setActiveId}
        hidden={false}
        knowledgeId={knowledgeId}
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
        knowledgeId={knowledgeId}
        knowledgeName={knowledgeName}
      />
    </Box>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
