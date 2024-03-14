// ** React Imports
import { useEffect, useState, Fragment } from 'react'

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
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

import { ChatKnowledgeInit, ChatKnowledgeInput, ChatKnowledgeOutput, CheckPermission } from 'src/functions/ChatBook'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [knowledge, setKnowledge] = useState<any>(null)
  const [knowledgeId, setKnowledgeId] = useState<number>(0)
  const [knowledgeName, setKnowledgeName] = useState<string>("")

  const getAllKnowledgeList = async function () {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/knowledge/0/100', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setKnowledge(RS)
      if(RS && RS['data'] && RS['data'][0] && RS['data'][0].id && knowledgeId == 0) {
        setKnowledgeId(RS['data'][0].id)
        setKnowledgeName(RS['data'][0].name)
        getChatLogList(RS['data'][0].id)
      }
    }
  }

  const getChatLogList = async function (knowledgeId: number) {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/chatlog/' + knowledgeId + '/' + auth.user.id + '/0/90', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      const ChatKnowledgeInitList = ChatKnowledgeInit(RS['data'].reverse())
      console.log("ChatKnowledgeInitList", ChatKnowledgeInitList)
      const selectedChat = {
        "chat": {
            "id": 1,
            "userId": auth.user.id,
            "unseenMsgs": 0,
            "chat": ChatKnowledgeInitList
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
  const [processingMessage, setProcessingMessage] = useState("")
  const lastChat = {
    "message": processingMessage,
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
      const ChatKnowledgeText = window.localStorage.getItem("ChatKnowledge")      
      const ChatKnowledgeList = ChatKnowledgeText ? JSON.parse(ChatKnowledgeText) : []
      if(processingMessage && processingMessage!="") {
        ChatKnowledgeList.push(lastChat)
      }
      const selectedChat = {
        "chat": {
            "id": auth.user.id,
            "userId": auth.user.id,
            "unseenMsgs": 0,
            "chat": ChatKnowledgeList
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
  }, [refreshChatCounter, processingMessage, auth])

  useEffect(() => {
    getAllKnowledgeList()  
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Your message...") as string)    
  }, [])

  const sendMsg = async (Obj: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      ChatKnowledgeInput(Obj.message, auth.user.id, knowledgeId)
      setRefreshChatCounter(refreshChatCounter + 1)
      const ChatKnowledgeOutputStatus = await ChatKnowledgeOutput(Obj.message, auth.user.token, auth.user.id, knowledgeId, setProcessingMessage)
      if(ChatKnowledgeOutputStatus) {
        setSendButtonDisable(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Your message...") as string)  
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
      :
      null
      }
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
