import authConfig from 'src/configs/auth'

const ChatKnowledge = 'ChatKnowledge'
const ChatChat = 'ChatChat'

const ChatChatName = 'ChatChatName'
const ChatKnowledgeHistory = 'ChatKnowledgeHistory'
const ChatChatHistory = 'ChatChatHistory'
const ChatBookLanguage = 'ChatBookLanguage'

const ChatWebPage = 'ChatWebPage'
const ChatWebPageHistory = 'ChatWebPageHistory'

export function ChatKnowledgeInit(MsgList: any) {
  const ChatLogList: any = []
  MsgList.map((Item: any) => {
    ChatLogList.push({
      message: Item.send,
      time: Item.timestamp,
      senderId: Item.userId,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    })
    ChatLogList.push({
      message: Item.received,
      time: Item.timestamp,
      senderId: 9999999999,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    })
  })
  window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatLogList))

  return ChatLogList
}

export function ChatWebPageInit(MsgList: any) {
  const ChatLogList: any = []
  MsgList.map((Item: any) => {
    ChatLogList.push({
      message: Item.send,
      time: Item.timestamp,
      senderId: Item.userId,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    })
    ChatLogList.push({
      message: Item.received,
      time: Item.timestamp,
      senderId: 9999999999,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    })
  })
  window.localStorage.setItem(ChatWebPage, JSON.stringify(ChatLogList))

  return ChatLogList
}

export function ChatKnowledgeInput(Message: string, UserId: number, knowledgeId: number) {
  const ChatKnowledgeText = window.localStorage.getItem(ChatKnowledge)
  const ChatKnowledgeList = ChatKnowledgeText ? JSON.parse(ChatKnowledgeText) : []
  ChatKnowledgeList.push({
    message: Message,
    time: String(Date.now()),
    senderId: UserId,
    knowledgeId: knowledgeId,
    feedback: {
      isSent: true,
      isDelivered: true,
      isSeen: true
    }
  })
  window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatKnowledgeList))
}

export function ChatWebPageInput(Message: string, UserId: number, knowledgeId: number) {
  const ChatWebPageText = window.localStorage.getItem(ChatWebPage)
  const ChatWebPageList = ChatWebPageText ? JSON.parse(ChatWebPageText) : []
  ChatWebPageList.push({
    message: Message,
    time: String(Date.now()),
    senderId: UserId,
    knowledgeId: knowledgeId,
    feedback: {
      isSent: true,
      isDelivered: true,
      isSeen: true
    }
  })
  window.localStorage.setItem(ChatWebPage, JSON.stringify(ChatWebPageList))
}

export async function ChatKnowledgeOutput(
  Message: string,
  Token: string,
  UserId: number,
  knowledgeId: number,
  setLastMessage: any
) {
  const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)
  const ChatKnowledgeList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : []
  const History: any = []
  if (ChatKnowledgeList && ChatKnowledgeList[UserId] && ChatKnowledgeList[UserId][knowledgeId]) {
    const ChatKnowledgeListLast10 = ChatKnowledgeList[UserId][knowledgeId].slice(-10)
    ChatKnowledgeListLast10.map((Item: any) => {
      if (Item.question && Item.answer) {
        History.push([Item.question, Item.answer.substring(0, 200)])
      }
    })
  }
  try {
    setLastMessage('')
    const response = await fetch(authConfig.backEndApiChatBook + `/api/ChatOpenaiKnowledge`, {
      method: 'POST',
      headers: {
        Authorization: Token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: Message, history: History, knowledgeId: knowledgeId })
    })
    if (!response.body) {
      throw new Error('Response body is not readable as a stream')
    }
    const reader = response.body.getReader()
    let responseText = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        setLastMessage('')
        break
      }
      const text = new TextDecoder('utf-8').decode(value)
      setLastMessage((prevText: string) => prevText + text)
      responseText = responseText + text
    }
    if (responseText) {
      console.log('OpenAI Response:', responseText)
      ChatKnowledgeInput(responseText, 999999, knowledgeId)
      ChatKnowledgeHistoryInput(Message, responseText, UserId, knowledgeId)

      return true
    } else {
      return false
    }
  } catch (error: any) {
    console.log('Error:', error.message)

    return false
  }
}

export async function ChatWebPageOutput(
  Message: string,
  Token: string,
  UserId: number,
  WebChatId: number,
  setLastMessage: any
) {
  const ChatWebPageHistoryText = window.localStorage.getItem(ChatWebPageHistory)
  const ChatWebPageList = ChatWebPageHistoryText ? JSON.parse(ChatWebPageHistoryText) : []
  const History: any = []
  if (ChatWebPageList && ChatWebPageList[UserId] && ChatWebPageList[UserId][WebChatId]) {
    const ChatWebpageListLast10 = ChatWebPageList[UserId][WebChatId].slice(-10)
    ChatWebpageListLast10.map((Item: any) => {
      if (Item.question && Item.answer) {
        History.push([Item.question, Item.answer.substring(0, 200)])
      }
    })
  }
  try {
    setLastMessage('')
    const response = await fetch(authConfig.backEndApiChatBook + `/api/ChatOpenaiWebPage`, {
      method: 'POST',
      headers: {
        Authorization: Token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: Message, history: History, WebChatId: WebChatId })
    })
    if (!response.body) {
      throw new Error('Response body is not readable as a stream')
    }
    const reader = response.body.getReader()
    let responseText = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        setLastMessage('')
        break
      }
      const text = new TextDecoder('utf-8').decode(value)
      setLastMessage((prevText: string) => prevText + text)
      responseText = responseText + text
    }
    if (responseText) {
      console.log('OpenAI Response:', responseText)
      ChatWebPageInput(responseText, 999999, knowledgeId)

      return true
    } else {
      return false
    }
  } catch (error: any) {
    console.log('Error:', error.message)

    return false
  }
}

export function ChatKnowledgeHistoryInput(question: string, answer: string, UserId: number, knowledgeId: number) {
  console.log('ChatKnowledgeHistoryList', question, answer, UserId)
  const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)
  const ChatKnowledgeHistoryList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : {}
  if (ChatKnowledgeHistoryList && ChatKnowledgeHistoryList[UserId] && ChatKnowledgeHistoryList[UserId][knowledgeId]) {
    ChatKnowledgeHistoryList[UserId][knowledgeId].push({
      question: question,
      time: String(Date.now()),
      answer: answer
    })
  } else {
    ChatKnowledgeHistoryList[UserId] = {}
    ChatKnowledgeHistoryList[UserId][knowledgeId] = [
      {
        question: question,
        time: String(Date.now()),
        answer: answer
      }
    ]
  }
  console.log('ChatKnowledgeHistoryList', ChatKnowledgeHistoryList)
  window.localStorage.setItem(ChatKnowledgeHistory, JSON.stringify(ChatKnowledgeHistoryList))
}

export function ChatChatList() {
  const ChatChatText = window.localStorage.getItem(ChatChat)
  const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []

  return ChatChatList
}

export function ChatChatNameList() {
  const ChatChatText = window.localStorage.getItem(ChatChatName)
  const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []

  return ChatChatList
}

export function SetChatChatName(Id: number, Name: string) {
  const ChatChatText = window.localStorage.getItem(ChatChatName)
  const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
  ChatChatList[Id] = Name
  window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function AddChatChatName(Name: string) {
  const ChatChatText = window.localStorage.getItem(ChatChatName)
  const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
  ChatChatList.push(Name)
  window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function DeleteChatChatName(Id: number) {
  const ChatChatText = window.localStorage.getItem(ChatChatName)
  const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
  if (Id >= 0 && Id < ChatChatList.length) {
    ChatChatList.splice(Id, 1)
  }
  window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function ChatChatInit(MsgList: any) {
  const ChatLogList: any = []
  MsgList.map((Item: any) => {
    ChatLogList.push({
      message: Item.send,
      time: Item.timestamp,
      senderId: Item.userId,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    })
    ChatLogList.push({
      message: Item.received,
      time: Item.timestamp,
      senderId: 999999,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    })
  })
  window.localStorage.setItem(ChatChat, JSON.stringify(ChatLogList))

  return ChatLogList
}

export function ChatChatInput(Message: string, UserId: number) {
  const ChatChatText = window.localStorage.getItem(ChatChat)
  const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
  ChatChatList.push({
    message: Message,
    time: Date.now(),
    senderId: UserId,
    feedback: {
      isSent: true,
      isDelivered: true,
      isSeen: true
    }
  })
  window.localStorage.setItem(ChatChat, JSON.stringify(ChatChatList))
}

export async function ChatChatOutput(
  Message: string,
  Token: string,
  UserId: number,
  chatId: number | string,
  setLastMessage: any
) {
  const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)
  const ChatChatList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : []
  const History: any = []
  if (ChatChatList && ChatChatList[UserId] && ChatChatList[UserId][chatId]) {
    const ChatChatListLast10 = ChatChatList[UserId][chatId].slice(-10)
    ChatChatListLast10.map((Item: any) => {
      if (Item.question && Item.answer) {
        History.push([Item.question, Item.answer.substring(0, 200)])
      }
    })
  }
  try {
    setLastMessage('')
    let modelName = ''
    switch (chatId) {
      case 'ChatGPT3.5':
        modelName = 'ChatOpenai'
        break
      case 'ChatGPT4':
        modelName = 'ChatOpenai'
        break
      case 'Gemini':
        modelName = 'ChatGemini'
        break
      case 'BaiduWenxin':
        modelName = 'ChatBaiduwenxin'
        break
      case 'Dall-E-2':
        modelName = 'DallE2Openai'
        break
      default:
        modelName = String(chatId)
        break
    }
    console.log('chatId', chatId)
    if (modelName != '') {
      const response = await fetch(authConfig.backEndApiChatBook + `/api/` + modelName, {
        method: 'POST',
        headers: {
          Authorization: Token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: Message, history: History, knowledgeId: chatId })
      })
      if (!response.body) {
        throw new Error('Response body is not readable as a stream')
      }
      const reader = response.body.getReader()
      let responseText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          setLastMessage('')
          break
        }
        const text = new TextDecoder('utf-8').decode(value)
        setLastMessage((prevText: string) => prevText + text)
        responseText = responseText + text
      }
      if (responseText) {
        console.log('OpenAI Response:', responseText)
        ChatChatInput(responseText, 999999)
        ChatChatHistoryInput(Message, responseText, UserId, chatId)

        return true
      } else {
        return true
      }
    } else {
      return false
    }
  } catch (error: any) {
    console.log('Error:', error.message)

    return true
  }
}

export function ChatChatHistoryInput(question: string, answer: string, UserId: number, knowledgeId: number | string) {
  console.log('ChatChatHistoryList', question, answer, UserId)
  const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)
  const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
  if (ChatChatHistoryList && ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId]) {
    ChatChatHistoryList[UserId][knowledgeId].push({
      question: question,
      time: String(Date.now()),
      answer: answer
    })
  } else {
    ChatChatHistoryList[UserId] = {}
    ChatChatHistoryList[UserId][knowledgeId] = [
      {
        question: question,
        time: String(Date.now()),
        answer: answer
      }
    ]
  }
  console.log('ChatChatHistoryList', ChatChatHistoryList)
  window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
}

export function getChatBookLanguage() {
  const ChatBookLanguageValue = window.localStorage.getItem(ChatBookLanguage) || 'en'

  return ChatBookLanguageValue
}

export function setChatBookLanguage(Language: string) {
  window.localStorage.setItem(ChatBookLanguage, Language)

  return true
}

export function GetAllLLMS(): any[] {
  const AllLLMS: any[] = []

  //AllLLMS.push({name:"Gemini", id:"Gemini", avatar:"/images/llms/Gemini.webp", summary:'Google Gemini'})

  AllLLMS.push({
    name: 'ChatGPT 3.5',
    id: 'ChatGPT3.5',
    avatar: '/images/llms/ChatGPT.webp',
    summary: 'OpenAI ChatGPT3.5'
  })
  AllLLMS.push({
    name: 'ChatGPT 4',
    id: 'ChatGPT4',
    avatar: '/images/llms/ChatGPT-4.webp',
    summary: 'OpenAI ChatGPT 4'
  })

  //AllLLMS.push({name:"Llama 2", id:"Llama2", avatar:"/images/llms/llama2.webp", summary:'Facebook Llama 2'})

  AllLLMS.push({
    name: 'Baidu Wenxin',
    id: 'BaiduWenxin',
    avatar: '/images/llms/BaiduWenxin.png',
    summary: 'Baidu Wenxin'
  })

  //AllLLMS.push({name:"Generate Image", id:"Dall-E-2", avatar:"/images/llms/openai-dall-e-2.png", summary:'Openai Dall-E-2 generate image'})
  //AllLLMS.push({name:"Generate Audio", id:"TTS-1", avatar:"/images/llms/openai-dall-e-2.png", summary:'Openai TTS-1 genereate audio'})

  return AllLLMS
}

export function GetWebChatList(): any[] {
  const WebChatList: any[] = []

  WebChatList.push({
    name: 'WebSearch',
    id: 'WebSearch',
    avatar: '/images/llms/Gemini.webp',
    summary: 'Find answer by using google search api'
  })
  WebChatList.push({
    name: 'URLSearch',
    id: 'URLSearch',
    avatar: '/images/llms/BaiduWenxin.png',
    summary: 'Get answer by scraping give specific URL'
  })

  return WebChatList
}

export function GetAllLLMById(id: string): any[] {
  const GetAllLLMSData = GetAllLLMS()

  return GetAllLLMSData.filter((Item: any) => Item.id == id)
}

export function GetWebChatById(id: string): any[] {
  const GetWebChatListData = GetWebChatList()

  return GetWebChatListData.filter((Item: any) => Item.id == id)
}

export function CheckPermission(auth: any, router: any, forcelogout: boolean) {
  const roleList = ['admin', 'user']
  console.log('auth.user.role', auth)
  console.log('auth.user.role', auth.user)
  if (auth && auth.user && auth.user.loading == '1') {
    // User info loaded by browser
    if (auth && auth.user && auth.user.role && roleList.includes(auth.user.role)) {
      //Permission Valid
    } else if (router && auth && auth.user && auth.user.role) {
      console.log('auth.user', auth.user)
      router.replace('/login')
    }
  }
  if (forcelogout) {
    router.replace('/login')
  }
}
