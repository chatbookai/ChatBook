import authConfig from 'src/configs/auth'
import axios from 'axios'

const ChatKnowledge = "ChatKnowledge"
const ChatChat = "ChatChat"
const ChatChatName = "ChatChatName"
const ChatKnowledgeHistory = "ChatKnowledgeHistory"
const ChatChatHistory = "ChatChatHistory"
const ChatBookLanguage = "ChatBookLanguage"

export async function GetLLMS() {
    const response = await axios.get(authConfig.backEndApiChatBook + '/api/llms', { }).then(res=>res.data)
    return response
}

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

export function DeleteChatChatHistory(UserId: number, knowledgeId: number | string, appId: string) {
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        ChatChatHistoryList[UserId][knowledgeId][appId] = []
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
            "history": [],
            "responseTime": 0,
            "chatlogId": 0,
            "question": '',
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
        })
    }
    console.log("MsgList", MsgList)
    MsgList.map((Item: any)=>{
        ChatLogList.push({
            "message": Item.send,
            "time": Item.timestamp,
            "senderId": Item.userId,
            "chatlogId": Item._id,
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
            "history": JSON.parse(Item.history),
            "responseTime": Item.responseTime,
            "chatlogId": Item._id,
            "question": Item.send,
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

export function ChatChatInput(chatlogId: string, Question: string, Message: string, UserId: number, responseTime: number, History: any[]) {
	const ChatChatText = window.localStorage.getItem(ChatChat)      
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList.push({
      "message": Message,
      "time": Date.now(),
      "responseTime": responseTime,
      "chatlogId": chatlogId,
      "senderId": UserId,
      "history": History,
      "question": Question,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatChat, JSON.stringify(ChatChatList))
}

export async function ChatChatOutput(Message: string, Token: string, UserId: number, chatId: number | string, appId: string, setProcessingMessage:any, template: string, setFinishedMessage:any) {
}

export async function ChatAiAudioV1(Message: string, Token: string, voice: string, appId: string) {
    try {
        const response = await axios.post(authConfig.backEndApiChatBook + '/api/app/audio', {
                            question: Message,
                            voice: voice,
                            appId: appId
                        }, {
                            headers: {
                                Authorization: Token,
                                'Content-Type': 'application/json',
                            }
                        }).then(res=>res.data);
        
        return response;
    } 
    catch (error: any) {
        console.log('Error:', error.message);
        
        return
    }
      
}

export async function ChatAiOutputV1(_id: string, Message: string, Token: string, UserId: number, chatId: number | string, appId: string, setProcessingMessage:any, template: string, setFinishedMessage:any) {
    const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : []
    const History: any = []
    if(ChatChatList && ChatChatList[UserId] && ChatChatList[UserId][chatId] && ChatChatList[UserId][chatId][appId]) {
        const ChatChatListLast10 = ChatChatList[UserId][chatId][appId].slice(-10)
        ChatChatListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question, Item.answer.substring(0, 200)])
            }
        })
    }
    try {
        setProcessingMessage('')
        console.log("chatId", chatId)
        if(true)  {
            const startTime = performance.now()
            const response = await fetch(authConfig.backEndApiChatBook + `/api/ChatApp`, {
            method: 'POST',
            headers: {
                Authorization: Token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: Message, history: History, appId: appId, template: template, _id }),
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
                const endTime = performance.now()
                const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100
                ChatChatInput(_id, Message, responseText, 999999, responseTime, History)
                ChatChatHistoryInput(_id, Message, responseText, UserId, chatId, appId, responseTime, History)
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

export function ChatChatHistoryInput(chatlogId: string, question: string, answer: string, UserId: number, knowledgeId: number | string, appId: string, responseTime: number, History: any[]) {
    console.log("ChatChatHistoryList", question, answer, UserId)
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList && ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        ChatChatHistoryList[UserId][knowledgeId][appId].push({
            "question": question,
            "time": String(Date.now()),
            "responseTime": responseTime,
            "chatlogId" : chatlogId,
            "history": History,
            "answer": answer,
        })
    }
    else {
        ChatChatHistoryList[UserId] = {}
        ChatChatHistoryList[UserId][knowledgeId] = {}
        ChatChatHistoryList[UserId][knowledgeId][appId] = [{
            "question": question,
            "time": String(Date.now()),
            "responseTime": responseTime,
            "chatlogId" : chatlogId,
            "history": History,
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

export function generateRandomNumber(min: number, max: number): number {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function downloadJson(JsonData: any, FileName: string) {
    console.log("downloadJson", JsonData);
    const blob = new Blob([JSON.stringify(JsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FileName + '.json';
    a.click();
    URL.revokeObjectURL(url);
}