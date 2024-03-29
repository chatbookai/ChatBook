import authConfig from 'src/configs/auth'

const ChatKnowledge = "ChatKnowledge"
const ChatChat = "ChatChat"
const ChatChatName = "ChatChatName"
const ChatKnowledgeHistory = "ChatKnowledgeHistory"
const ChatChatHistory = "ChatChatHistory"
const ChatBookLanguage = "ChatBookLanguage"

export function ChatKnowledgeInit(MsgList: any) {
    const ChatLogList: any = []
    MsgList.map((Item: any)=>{
        ChatLogList.push({
            "message": Item.send,
            "time": Item.timestamp,
            "senderId": Item.userId,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
        ChatLogList.push({
            "message": Item.received,
            "time": Item.timestamp,
            "senderId": 9999999999,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
    })
    window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatLogList))

    return ChatLogList
}

export function ChatKnowledgeInput(Message: string, UserId: number, knowledgeId: number) {
	const ChatKnowledgeText = window.localStorage.getItem(ChatKnowledge)      
    const ChatKnowledgeList = ChatKnowledgeText ? JSON.parse(ChatKnowledgeText) : []
    ChatKnowledgeList.push({
      "message": Message,
      "time": String(Date.now()),
      "senderId": UserId,
      "knowledgeId": knowledgeId,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatKnowledgeList))
}

export async function ChatKnowledgeOutput(Message: string, Token: string, UserId: number, knowledgeId: number, setProcessingMessage:any) {
    const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)      
    const ChatKnowledgeList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : []
    const History: any = []
    if(ChatKnowledgeList && ChatKnowledgeList[UserId] && ChatKnowledgeList[UserId][knowledgeId]) {
        const ChatKnowledgeListLast10 = ChatKnowledgeList[UserId][knowledgeId].slice(-10)
        ChatKnowledgeListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer.substring(0, 200)])
            }
        })
    }
    try {
        setProcessingMessage('')
        const response = await fetch(authConfig.backEndApiChatBook + `/api/ChatOpenaiKnowledge`, {
          method: 'POST',
          headers: {
            Authorization: Token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: Message, history: History, knowledgeId: knowledgeId }),
        });
        if (!response.body) {
          throw new Error('Response body is not readable as a stream');
        }
        const reader = response.body.getReader();
        let responseText = "";
        while (true) {
          const { done, value } = await reader.read();
          const text = new TextDecoder('utf-8').decode(value);
          setProcessingMessage((prevText: string) => prevText + text);
          responseText = responseText + text;
          if (done) {
            setProcessingMessage('')
            break;
          }
        }
        if(responseText) {
            console.log("OpenAI Response:", responseText)
            ChatKnowledgeInput(responseText, 999999, knowledgeId)
            ChatKnowledgeHistoryInput(Message, responseText, UserId, knowledgeId)
            setProcessingMessage(responseText);

            return true
        }
        else {
            return false
        }

    } 
    catch (error: any) {
        console.log('Error:', error.message);
        
        return false
    }
}

export function ChatKnowledgeHistoryInput(question: string, answer: string, UserId: number, knowledgeId: number) {
    console.log("ChatKnowledgeHistoryList", question, answer, UserId)
	const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)      
    const ChatKnowledgeHistoryList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : {}
    if(ChatKnowledgeHistoryList && ChatKnowledgeHistoryList[UserId] && ChatKnowledgeHistoryList[UserId][knowledgeId]) {
        ChatKnowledgeHistoryList[UserId][knowledgeId].push({
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChatKnowledgeHistoryList[UserId] = {}
        ChatKnowledgeHistoryList[UserId][knowledgeId] = [{
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        }]
    }
    console.log("ChatKnowledgeHistoryList", ChatKnowledgeHistoryList)
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
        ChatChatList.splice(Id, 1);
    }
    window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function DeleteChatChat() {
    window.localStorage.setItem(ChatChat, JSON.stringify([]))
}

export function DeleteChatChatHistory(UserId: number, knowledgeId: number | string, agentId: number) {
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][agentId]) {
        ChatChatHistoryList[UserId][knowledgeId][agentId] = []
        window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
    }
}

export function ChatChatInit(MsgList: any, PromptTemplate: string) {
    const ChatLogList: any = []
    if(PromptTemplate && PromptTemplate!= "") {
        ChatLogList.push({
            "message": PromptTemplate,
            "time": Date.now(),
            "senderId": 999999,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
        })
    }
    MsgList.map((Item: any)=>{
        ChatLogList.push({
            "message": Item.send,
            "time": Item.timestamp,
            "senderId": Item.userId,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
        ChatLogList.push({
            "message": Item.received,
            "time": Item.timestamp,
            "senderId": 999999,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
    })
    console.log("MsgList", MsgList)
    window.localStorage.setItem(ChatChat, JSON.stringify(ChatLogList))

    return ChatLogList
}

export function ChatChatInput(Message: string, UserId: number) {
	const ChatChatText = window.localStorage.getItem(ChatChat)      
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList.push({
      "message": Message,
      "time": Date.now(),
      "senderId": UserId,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatChat, JSON.stringify(ChatChatList))
}

export async function ChatChatOutput(Message: string, Token: string, UserId: number, chatId: number | string, agentId: number, setProcessingMessage:any, template: string, setFinishedMessage:any) {
    const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : []
    const History: any = []
    if(ChatChatList && ChatChatList[UserId] && ChatChatList[UserId][chatId] && ChatChatList[UserId][chatId][agentId]) {
        const ChatChatListLast10 = ChatChatList[UserId][chatId][agentId].slice(-10)
        ChatChatListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer.substring(0, 200)])
            }
        })
    }
    try {
        setProcessingMessage('')
        let modelName = ''
        switch(chatId) {
            case 'ChatGPT3.5':
                modelName = 'ChatOpenai'
                break;
            case 'ChatGPT4':
                modelName = 'ChatOpenai'
                break;
            case 'Gemini':
                modelName = 'ChatGemini'
                break;
            case 'GeminiMindMap':
                modelName = 'ChatGeminiMindMap'
                break;
            case 'BaiduWenxin':
                modelName = 'ChatBaiduwenxin'
                break;
            case 'Dall-E-2':
                modelName = 'DallE2Openai'
                break;
            default:
                modelName = String(chatId);
                break;
        }
        console.log("chatId", chatId)
        if(modelName != '')  {
            const response = await fetch(authConfig.backEndApiChatBook + `/api/` + modelName, {
            method: 'POST',
            headers: {
                Authorization: Token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: Message, history: History, knowledgeId: chatId, agentId: agentId, template: template }),
            });
            if (!response.body) {
            throw new Error('Response body is not readable as a stream');
            }
            const reader = response.body.getReader();
            let responseText = "";
            while (true) {
                const { done, value } = await reader.read();
                const text = new TextDecoder('utf-8').decode(value);
                setProcessingMessage((prevText: string) => prevText + text);
                responseText = responseText + text;
                if (done) {
                    setProcessingMessage('')
                    break;
                }
            }
            if(responseText) {
                console.log("OpenAI Response:", responseText)
                ChatChatInput(responseText, 999999)
                ChatChatHistoryInput(Message, responseText, UserId, chatId, agentId)
                setFinishedMessage(responseText);
        
                return true
            }
            else {
                return true
            }
        }
        else {
            return false
        }

    } 
    catch (error: any) {
        console.log('Error:', error.message);
        
        return true
    }
      
}

export function ChatChatHistoryInput(question: string, answer: string, UserId: number, knowledgeId: number | string, agentId: number) {
    console.log("ChatChatHistoryList", question, answer, UserId)
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList && ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][agentId]) {
        ChatChatHistoryList[UserId][knowledgeId][agentId].push({
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChatChatHistoryList[UserId] = {}
        ChatChatHistoryList[UserId][knowledgeId] = {}
        ChatChatHistoryList[UserId][knowledgeId][agentId] = [{
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        }]
    }
    window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
}

export function getChatBookLanguage() {
    const ChatBookLanguageValue = window.localStorage.getItem(ChatBookLanguage) || "en"

    return ChatBookLanguageValue
};

export function setChatBookLanguage(Language: string) {
    window.localStorage.setItem(ChatBookLanguage, Language)

    return true
};

export function GetAllLLMS(): any[] {
    const AllLLMS: any[] = []
    
    AllLLMS.push({name:"Gemini", id:"Gemini", avatar:"/images/llms/Gemini.webp", summary:'Google Gemini'})
    
    AllLLMS.push({name:"ChatGPT 3.5", id:"ChatGPT3.5", avatar:"/images/llms/ChatGPT.webp", summary:'OpenAI ChatGPT3.5'})
    AllLLMS.push({name:"ChatGPT 4", id:"ChatGPT4", avatar:"/images/llms/ChatGPT-4.webp", summary:'OpenAI ChatGPT 4'})
    
    //AllLLMS.push({name:"Llama 2", id:"Llama2", avatar:"/images/llms/llama2.webp", summary:'Facebook Llama 2'})
    
    AllLLMS.push({name:"Baidu Wenxin", id:"BaiduWenxin", avatar:"/images/llms/BaiduWenxin.png", summary:'Baidu Wenxin'})

    AllLLMS.push({name:"Gemini Mind Map", id:"GeminiMindMap", avatar:"/images/llms/Gemini.webp", summary:'Google Gemini'})
    
    //AllLLMS.push({name:"Generate Image", id:"Dall-E-2", avatar:"/images/llms/openai-dall-e-2.png", summary:'Openai Dall-E-2 generate image'})
    //AllLLMS.push({name:"Generate Audio", id:"TTS-1", avatar:"/images/llms/openai-dall-e-2.png", summary:'Openai TTS-1 genereate audio'})

    return AllLLMS
}

export function GetAllLLMById(id: string): any[] {
    const GetAllLLMSData = GetAllLLMS()

    return GetAllLLMSData.filter((Item: any)=>Item.id == id)
}

export function CheckPermission(auth: any, router: any, forcelogout: boolean) {
    const roleList = ['admin', 'user']
    console.log("auth.user.role", auth)
    console.log("auth.user.role", auth.user)
    if(auth && auth.user && auth.user.loading == '1')  { // User info loaded by browser
        if(auth && auth.user && auth.user.role && roleList.includes(auth.user.role) ) {
            //Permission Valid
        }
        else if(router && auth && auth.user && auth.user.role) {
            console.log("auth.user", auth.user)
            router.replace('/login')
        }
    }
    if(forcelogout) {
        router.replace('/login')
    }
}

interface ReportSection {
    title: string;
    content: string[];
}

export function parseMarkdown(markdownText: string): ReportSection[] {
    const lines = markdownText.trim().split('\n');
    const sections: ReportSection[] = [];
    let currentTitle = '';
    let currentContent = [];
    const linesNew = [];

    for (const line of lines) {
        if(line && line.trim() && line.trim()!='') {
            linesNew.push(line.trim())
        }
    }

    for (const line of linesNew) {
        if (line.startsWith("**")) {
            if (currentTitle != line.replaceAll("**", "").trim()) {
                sections.push({ title: currentTitle, content: currentContent });
                currentTitle = line.replaceAll("**", "").trim();
            }
            currentContent = [];
        } 
        else {
            currentContent.push(line.replaceAll("* ", "").trim());
        }
    }

    // Push the last section into the array
    if (currentTitle && currentContent.length>0) {
        sections.push({ title: currentTitle, content: currentContent });
    }

    return sections.filter((Item: any) => Item.title != '');
}
  