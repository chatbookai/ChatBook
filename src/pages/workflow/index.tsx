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
import FlowContent from 'src/views/workflow/FlowContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetAllLLMS, ChatChatInit, ChatChatNameList, ChatChatInput, ChatChatOutput, parseMarkdown  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

import { useNodesState, useEdgesState, Node, Edge } from 'reactflow';
import 'reactflow/dist/base.css';
import { TurboNodeData } from 'src/views/chat/Flow/TurboNode';

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
        const ChatChatInitList = ChatChatInit(RS['data'].reverse(), "")
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
        const processingMessageArray = parseMarkdown(processingMessage);
        setDisabledButton(false)

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
        processingMessageArray.map((Item: any)=>{
          TotalCount += Item.content.length;
        })
        const subContentCounter = Math.ceil(TotalCount/2)-1;

        const subItemsCounter = Math.ceil(processingMessageArray.length/2)-1;
        processingMessageArray.map((Item: any, Index: number)=>{

          //Make Node Title
          const Y = (Index-subItemsCounter) * 100
          const X = 350
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
          Item.content && Item.content.length>0 && Item.content.map((ItemContent: string)=>{
            const YValue = (CurrentCount-subContentCounter) * 55
            const XValue = X + 350
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
        
        console.log("Mind Map Nodes processingMessageArray", processingMessageArray);
        console.log("Mind Map Nodes processingMessage************************", processingMessage);
        console.log("Mind Map Nodes lastQuestion************************", lastQuestion);
        console.log("Mind Map Nodes generateNodes:", generateNodes)
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
  }, [refreshChatCounter, processingMessage, auth])

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Your message...") as string)    

  }, [])

  const initialNodes: Node<TurboNodeData>[] = [];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ** Vars
  const { skin } = settings
  
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
      </Box>
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
