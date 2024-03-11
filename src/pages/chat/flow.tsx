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
import FlowContent from 'src/views/chat/Flow/FlowContent'
import FlowRight from 'src/views/chat/Flow/FlowRight'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetAllLLMS, ChatChatInit, ChatChatNameList, ChatChatInput, ChatChatOutput, parseMarkdown  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

import ReactFlow, { Controls, useNodesState, useEdgesState, addEdge, Node, Edge } from 'reactflow';
import 'reactflow/dist/base.css';
import TurboNode, { TurboNodeData } from 'src/views/chat/Flow/TurboNode';
import TurboEdge from 'src/views/chat/Flow/TurboEdge';
import FunctionIcon from 'src/views/chat/Flow/FunctionIcon';
import { FiFile } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [llms, setLlms] = useState<any>([])
  const [chatId, setChatId] = useState<number | string>(0)
  const [chatName, setChatName] = useState<string>("Gemini")

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
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [lastMessage, setLastMessage] = useState("")
  const [lastQuestion, setLastQuestion] = useState("")
  const [mindMapText, setMindMapText] = useState("")
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
    if(auth.user && auth.user.id)   {
      const ChatChatText = window.localStorage.getItem("ChatChat")      
      const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
      if(lastMessage && lastMessage!="") {
        ChatChatList.push(lastChat)
        setMindMapText(lastMessage)
        
        const lastMessageArray = parseMarkdown(lastMessage);
        console.log("lastMessageArray", lastMessageArray);
        console.log("lastQuestion************************", lastQuestion);

        const generateNodes: Node<TurboNodeData>[] = []
        const generateEdges: Edge[] = []
        generateNodes.push({
          id: '0',
          position: { x: 0, y: 0 },
          data: { title: lastQuestion },
          type: 'turbo',
        })

        let TotalCount = 0;
        let CurrentCount = 0;
        lastMessageArray.map((Item: any)=>{
          TotalCount += Item.content.length;
        })
        const subContentCounter = Math.ceil(TotalCount/2)-1;

        const subItemsCounter = Math.ceil(lastMessageArray.length/2)-1;
        lastMessageArray.map((Item: any, Index: number)=>{

          //Make Node Title
          const Y = (Index-subItemsCounter) * 100
          const X = 250
          const NodeId = String(Index+1)
          generateNodes.push({
            id: NodeId,
            position: { x: X, y: Y },
            data: { title: Item.title },
            type: 'turbo',
          })
          generateEdges.push({
            id: 'edges-' + NodeId,
            source: '0',
            target: NodeId,
          })

          //Make Node Content
          Item.content && Item.content.length>0 && Item.content.map((ItemContent: string, ItemIndex: number)=>{
            const YValue = (CurrentCount-subContentCounter) * 90
            const XValue = X + 300
            const NodeIdValue = String(CurrentCount+1)+"_Content"
            generateNodes.push({
              id: NodeIdValue,
              position: { x: XValue, y: YValue },
              data: { title: ItemContent },
              type: 'turbo',
            })
            generateEdges.push({
              id: 'edges-' + NodeIdValue,
              source: NodeId,
              target: NodeIdValue,
            })
            CurrentCount += 1
          })

        })
        console.log("Mind Map Nodes:", generateNodes)
        setNodes(generateNodes)
        setEdges(generateEdges)

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
  }, [refreshChatCounter, lastMessage, auth])

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Type your message here...") as string)    

  }, [])

  const initialNodes: Node<TurboNodeData>[] = [];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const sendMsg = async (Obj: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Generating the answer...") as string)
      ChatChatInput(Obj.message, auth.user.id)
      setRefreshChatCounter(refreshChatCounter + 1)
      const ChatChatOutputStatus = await ChatChatOutput(Obj.message, auth.user.token, auth.user.id, chatId, setLastMessage)
      if(ChatChatOutputStatus) {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Type your message here...") as string)  
      }
      setLastQuestion(Obj.message)
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
        <FlowContent
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            edges={edges}
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
        />
        <FlowRight
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
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            edges={edges}
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
            />
      </Box>
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
