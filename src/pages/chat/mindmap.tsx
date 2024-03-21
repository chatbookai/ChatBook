// ** React Imports
import { Fragment, useEffect, useState, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Types
import { StatusObjType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import MindMapContent from 'src/views/chat/MindMap/MindMapContent'
import MindMapRight from 'src/views/chat/MindMap/MindMapRight'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetAllLLMS, ChatChatInit, ChatChatNameList, ChatChatInput, ChatChatOutput, parseMarkdown  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [chatId, setChatId] = useState<number | string>(0)
  const [chatName, setChatName] = useState<string>("GeminiMindMap")
  const [disabledButton, setDisabledButton] = useState<boolean>(false)

  const AllLLMS: any[] = GetAllLLMS()

  useEffect(() => {
    setChatId(AllLLMS[4].id)
    setChatName(AllLLMS[4].name)
    getChatLogList(AllLLMS[4].id)
    console.log("AllLLMS", AllLLMS)
  }, [])

  const getChatLogList = async function (knowledgeId: number | string) {
    if (auth && auth.user) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/chatlog/agent/' + knowledgeId + '/' + auth.user.id + '/0/90', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS['data'])  {
        const ChatChatInitList = ChatChatInit(RS['data'].reverse())
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

  // ** States
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [processingMessage, setProcessingMessage] = useState("")
  const [finishedMessage, setFinishedMessage] = useState("")
  const [lastQuestion, setLastQuestion] = useState("")

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
    if(auth.user && auth.user.id)   {
      const ChatChatText = window.localStorage.getItem("ChatChat")      
      const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
      const ShowData = processingMessage && processingMessage!="" ? processingMessage : finishedMessage
      if(processingMessage && processingMessage!="") {
        
        //流式输出的时候,进来显示
        ChatChatList.push(lastChat)
      }
      if(ShowData) {

        const processingMessageArray = parseMarkdown(ShowData);
        setDisabledButton(false)

        const childrenOne: any[] = [];
        const processingMessageArrayLength = processingMessageArray.length;
        processingMessageArray.map((Item: any, Index: number)=>{
          const direction = processingMessageArrayLength/2 > Index ? 0 : 1
          const childrenTwo: any[] = [];
          Item.content && Item.content.length>0 && Item.content.map((ItemContent: string)=>{
            childrenTwo.push({"topic": ItemContent,"id": Math.random().toString(16)})
          })
          childrenOne.push({
            "topic": Item.title,
            "id": Math.random().toString(16),
            "direction": direction,
            "expanded": true,
            "children": childrenTwo
          })
        })
        const generateNodes: any = {
          "nodeData": {
            "id": "root",
            "topic": lastQuestion,
            "root": true,
            "children": childrenOne,
            "expanded": true
          },
          "linkData": {}
        }
        
        console.log("Mind Map Nodes processingMessageArray", processingMessageArray);
        console.log("Mind Map Nodes ShowData************************", ShowData);
        console.log("Mind Map Nodes lastQuestion************************", lastQuestion);
        console.log("Mind Map Nodes generateNodes:", generateNodes)
        if(childrenOne.length>0) {
          setData(generateNodes)
        }
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
    else {
      setSendButtonDisable(true)
      setSendButtonLoading(false)
      setSendButtonText(t('Login first') as string)
      console.log("lastChat************************ Not Login");
    }
  }, [refreshChatCounter, processingMessage, auth])

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Your message...") as string)    

  }, [])

  const [data, setData] = useState<any>({
    "nodeData": {
      "id": "root",
      "topic": "New Topic",
      "root": true,
      "children": [],
      "expanded": true
    },
    "linkData": {}
  });
  const ME: any = useRef(null)

  const sendMsg = async (Obj: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      setLastQuestion(Obj.message)
      ChatChatInput(Obj.message, auth.user.id)
      setRefreshChatCounter(refreshChatCounter + 1)
      const ChatChatOutputStatus = await ChatChatOutput(Obj.message, auth.user.token, auth.user.id, chatId, 0, setProcessingMessage, Obj.template, setFinishedMessage)
      if(ChatChatOutputStatus) {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Your message...") as string)  
      }
    }
  }

  const downloadPng = async (lastQuestion: string) => {
    if(ME && ME.current && ME.current.instance)   {
      const blob = await ME.current.instance.exportPng() // Get a Blob!
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = lastQuestion + '.png'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const downloadMarkdown = async (lastQuestion: string) => {
    if(ME && ME.current && ME.current.instance)   {
      const text = await ME.current.instance.getDataMd(); // Assuming this function retrieves the markdown text
      console.log("text", text);
      if (!text) return;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lastQuestion + '.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  const downloadXMind = async (lastQuestion: string) => {
    if(ME && ME.current && ME.current.instance)   {
      const text = await ME.current.instance.exportXmindFile();
      console.log("text", text);
      if (!text) return;
      const blob = new Blob([text], { type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lastQuestion + '.md';
      a.click();
      URL.revokeObjectURL(url);
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
        <MindMapContent
            data={data}
            ME={ME}
        />
        <MindMapRight
            store={store}
            hidden={hidden}
            sendMsg={sendMsg}
            mdAbove={mdAbove}
            statusObj={statusObj}
            sendButtonDisable={sendButtonDisable}
            sendButtonLoading={sendButtonLoading}
            sendButtonText={sendButtonText}
            sendInputText={sendInputText}
            chatId={chatId}
            chatName={chatName}
            lastQuestion={lastQuestion}
            disabledButton={disabledButton}
            setDisabledButton={setDisabledButton}
            downloadPng={downloadPng}
            downloadMarkdown={downloadMarkdown}
            downloadXMind={downloadXMind}
            />
      </Box>
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
