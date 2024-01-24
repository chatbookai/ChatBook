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
import ChatLeft from 'src/views/form/ChatLeft'
import ChatContent from 'src/views/chat/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

import { ChatChatList, ChatChatNameList, SetChatChatName, AddChatChatName, DeleteChatChatName, ChatChatInput, ChatChatOutput  } from 'src/functions/ChatBook'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [chatList, setChatList] = useState<any>(null)
  const [chatId, setChatId] = useState<number>(-1)
  const [chatName, setChatName] = useState<string>("")
  const userId = 1

  const getAllChatList = function () {
    const ChatChatNameListData: string[] = ChatChatNameList()
    setChatList(ChatChatNameListData)
    if(ChatChatNameListData && ChatChatNameListData.length > 0 && chatId == -1) {
      setChatId(0)
      setChatName(ChatChatNameListData[0])
    }
  }

  const getChatLogList = async function (chatId: number) {
    const RS = await axios.get(authConfig.backEndApi + '/chatlog/' + chatId + '/' + userId + '/0/100').then(res=>res.data)
    const ChatChatListData = ChatChatList()
    console.log("ChatChatListData", ChatChatListData)
    const selectedChat = {
      "chat": {
          "id": 1,
          "userId": 1,
          "unseenMsgs": 0,
          "chat": ChatChatListData
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
    setChatId(Id)
    setChatName(Name)
    getChatLogList(Id)
    setRefreshChatCounter(refreshChatCounter + 1)
  }

  const handleAddChatChatName = function () {
    const ChatChatNameListData: string[] = ChatChatNameList()
    AddChatChatName('New Chat(' + (ChatChatNameListData.length + 1) + ')')
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
    "KnowledgeId": 0,
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
    getAllChatList()
  }, [refreshChatCounter, lastMessage])

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      AddChatChatName('New Chat(' + (ChatChatNameListData.length + 1) + ')')
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    getAllChatList()  
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
      <ChatLeft
        chatList={chatList}
        setActiveId={setActiveId}
        hidden={false}
        handleAddChatChatName={handleAddChatChatName}
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
