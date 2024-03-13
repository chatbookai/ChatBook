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
import MindMapContent from 'src/views/chat/MindMap/MindMapContent'
import MindMapRight from 'src/views/chat/MindMap/MindMapRight'

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

  // ** States
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [lastMessage, setLastMessage] = useState("")
  const [lastQuestion, setLastQuestion] = useState("")

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
        
        const lastMessageArray = parseMarkdown(lastMessage);
        setDisabledButton(false)

        const generateNodes: Node<TurboNodeData>[] = []
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
          const X = 350
          const NodeId = String(Index+1)
          generateNodes.push({
            id: NodeId,
            position: { x: X, y: Y },
            data: { title: Item.title },
            type: 'turbo',
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
            CurrentCount += 1
          })

        })
        
        console.log("Mind Map Nodes lastMessageArray", lastMessageArray);
        console.log("Mind Map Nodes lastMessage************************", lastMessage);
        console.log("Mind Map Nodes lastQuestion************************", lastQuestion);
        console.log("Mind Map Nodes generateNodes:", generateNodes)
        setData({
          "nodeData": {
            "id": "root",
            "topic": "Mind Elixir",
            "root": true,
            "children": [
              {
                "topic": "What is Minde Elixir",
                "id": "bd4313fbac40284b",
                "direction": 0,
                "expanded": true,
                "children": [
                  {
                    "topic": "A mind map core",
                    "id": "beeb823afd6d2114"
                  },
                  {
                    "topic": "Free",
                    "id": "c1f068377de9f3a0"
                  },
                  {
                    "topic": "Open-Source",
                    "id": "c1f06d38a09f23ca"
                  },
                  {
                    "topic": "Use without JavaScript framework",
                    "id": "c1f06e4cbcf16463",
                    "expanded": true,
                    "children": []
                  },
                  {
                    "topic": "Use in your own project",
                    "id": "c1f1f11a7fbf7550",
                    "children": [
                      {
                        "topic": "import MindElixir from 'mind-elixir'",
                        "id": "c1f1e245b0a89f9b"
                      },
                      {
                        "topic": "new MindElixir({...}).init(data)",
                        "id": "c1f1ebc7072c8928"
                      }
                    ]
                  },
                  {
                    "topic": "Easy to use",
                    "id": "c1f0723c07b408d7",
                    "expanded": true,
                    "children": [
                      {
                        "topic": "Use it like other mind map application",
                        "id": "c1f09612fd89920d"
                      }
                    ]
                  }
                ]
              },
              {
                "topic": "Basics",
                "id": "bd1b66c4b56754d9",
                "direction": 0,
                "expanded": true,
                "children": [
                  {
                    "topic": "tab - Create a child node",
                    "id": "bd1b6892bcab126a"
                  },
                  {
                    "topic": "enter - Create a sibling node",
                    "id": "bd1b6b632a434b27"
                  },
                  {
                    "topic": "del - Remove a node",
                    "id": "bd1b983085187c0a"
                  }
                ]
              },
              {
                "topic": "Focus mode",
                "id": "bd1b9b94a9a7a913",
                "direction": 1,
                "expanded": true,
                "children": [
                  {
                    "topic": "Right click and select Focus Mode",
                    "id": "bd1bb2ac4bbab458"
                  },
                  {
                    "topic": "Right click and select Cancel Focus Mode",
                    "id": "bd1bb4b14d6697c3"
                  }
                ]
              },
              {
                "topic": "Left menu",
                "id": "bd1b9d1816ede134",
                "direction": 0,
                "expanded": true,
                "children": [
                  {
                    "topic": "Node distribution",
                    "id": "bd1ba11e620c3c1a",
                    "expanded": true,
                    "children": [
                      {
                        "topic": "Left",
                        "id": "bd1c1cb51e6745d3"
                      },
                      {
                        "topic": "Right",
                        "id": "bd1c1e12fd603ff6"
                      },
                      {
                        "topic": "Both l & r",
                        "id": "bd1c1f03def5c97b"
                      }
                    ]
                  }
                ]
              },
              {
                "topic": "Bottom menu",
                "id": "bd1ba66996df4ba4",
                "direction": 1,
                "expanded": true,
                "children": [
                  {
                    "topic": "Full screen",
                    "id": "bd1ba81d9bc95a7e"
                  },
                  {
                    "topic": "Return to Center",
                    "id": "bd1babdd5c18a7a2"
                  },
                  {
                    "topic": "Zoom in",
                    "id": "bd1bae68e0ab186e"
                  },
                  {
                    "topic": "Zoom out",
                    "id": "bd1bb06377439977"
                  }
                ]
              },
              {
                "topic": "Link",
                "id": "bd1beff607711025",
                "direction": 0,
                "expanded": true,
                "children": [
                  {
                    "topic": "Right click and select Link",
                    "id": "bd1bf320da90046a"
                  },
                  {
                    "topic": "Click the target you want to link",
                    "id": "bd1bf6f94ff2e642"
                  },
                  {
                    "topic": "Modify link with control points",
                    "id": "bd1c0c4a487bd036"
                  }
                ]
              },
              {
                "topic": "Node style",
                "id": "bd1c217f9d0b20bd",
                "direction": 0,
                "expanded": true,
                "children": [
                  {
                    "topic": "Font Size",
                    "id": "bd1c24420cd2c2f5",
                    "style": {
                      "fontSize": "32",
                      "color": "#3298db"
                    }
                  },
                  {
                    "topic": "Font Color",
                    "id": "bd1c2a59b9a2739c",
                    "style": {
                      "color": "#c0392c"
                    }
                  },
                  {
                    "topic": "Background Color",
                    "id": "bd1c2de33f057eb4",
                    "style": {
                      "color": "#bdc3c7",
                      "background": "#2c3e50"
                    }
                  },
                  {
                    "topic": "Add tags",
                    "id": "bd1cff58364436d0",
                    "tags": [
                      "Completed"
                    ]
                  },
                  {
                    "topic": "Add icons",
                    "id": "bd1d0317f7e8a61a",
                    "icons": [
                      "😂"
                    ],
                    "tags": [
                      "www"
                    ]
                  },
                  {
                    "topic": "Bolder",
                    "id": "bd41fd4ca32322a4",
                    "style": {
                      "fontWeight": "bold"
                    }
                  },
                  {
                    "topic": "Hyper link",
                    "id": "bd41fd4ca32322a5",
                    "hyperLink": "https://github.com/ssshooter/mind-elixir-core"
                  }
                ]
              },
              {
                "topic": "Draggable",
                "id": "bd1f03fee1f63bc6",
                "direction": 1,
                "expanded": true,
                "children": [
                  {
                    "topic": "Drag a node to another node\nand the former one will become a child node of latter one",
                    "id": "bd1f07c598e729dc"
                  }
                ]
              },
              {
                "topic": "TODO",
                "id": "bd1facea32a1967c",
                "direction": 1,
                "expanded": true,
                "children": [
                  {
                    "topic": "Add image",
                    "id": "bd1fb1ec53010749"
                  },
                  {
                    "topic": "Free node (position)",
                    "id": "bd42d3e3bee992b9"
                  },
                  {
                    "topic": "Style adjustment",
                    "id": "beeb7f3db6ad6496"
                  }
                ]
              },
              {
                "topic": "Export data",
                "id": "beeb7586973430db",
                "direction": 1,
                "expanded": true,
                "children": [
                  {
                    "topic": "JSON",
                    "id": "beeb784cc189375f"
                  },
                  {
                    "topic": "HTML",
                    "id": "beeb7a6bec2d68f5"
                  }
                ]
              },
              {
                "topic": "Caution",
                "id": "bd42dad21aaf6bae",
                "direction": 0,
                "style": {
                  "background": "#f1c40e"
                },
                "expanded": true,
                "children": [
                  {
                    "topic": "Only save manually",
                    "id": "bd42e1d0163ebf04",
                    "expanded": true,
                    "children": [
                      {
                        "topic": "Save button in the top-right corner",
                        "id": "bd42e619051878b3",
                        "expanded": true,
                        "children": []
                      },
                      {
                        "topic": "ctrl + S",
                        "id": "bd42e97d7ac35e99"
                      }
                    ]
                  }
                ]
              }
            ],
            "expanded": true
          },
          "linkData": {}
        })
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
    setSendInputText(t("Your message...") as string)    

  }, [])

  const initialNodes: Node<TurboNodeData>[] = [];

  const initialEdges: Edge[] = [];

  const [data, setData] = useState<any>(null);

  const sendMsg = async (Obj: any) => {
    if(auth.user && auth.user.token)  {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      setLastQuestion(Obj.message)
      ChatChatInput(Obj.message, auth.user.id)
      setRefreshChatCounter(refreshChatCounter + 1)
      const ChatChatOutputStatus = await ChatChatOutput(Obj.message, auth.user.token, auth.user.id, chatId, setLastMessage, Obj.template)
      if(ChatChatOutputStatus) {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
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
            setData={setData}
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
            />
      </Box>
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
