import axios from 'axios'
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
            "senderId": 999999,
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

export function ChatKnowledgeInput(Message: string, UserId: number, KnowledgeId: number) {
	const ChatKnowledgeText = window.localStorage.getItem(ChatKnowledge)      
    const ChatKnowledgeList = ChatKnowledgeText ? JSON.parse(ChatKnowledgeText) : []
    ChatKnowledgeList.push({
      "message": Message,
      "time": String(Date.now()),
      "senderId": UserId,
      "KnowledgeId": KnowledgeId,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatKnowledgeList))
}

export async function ChatKnowledgeOutput(Message: string, UserId: number, KnowledgeId: number) {
    const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)      
    const ChatKnowledgeList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : []
    const History: any = []
    if(ChatKnowledgeList && ChatKnowledgeList[UserId] && ChatKnowledgeList[UserId][KnowledgeId]) {
        const ChatKnowledgeListLast10 = ChatKnowledgeList[UserId][KnowledgeId].slice(-10)
        ChatKnowledgeListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer.substring(0, 200)])
            }
        })
    }
    const response: any = await axios.post(authConfig.backEndApi + "/chat/knowledge", { question: Message, history: History, KnowledgeId: KnowledgeId }).then((res) => res.data)
    if(response && response.text) {
        console.log("OpenAI Response:", response)
        ChatKnowledgeInput(response.text, 999999, KnowledgeId)
        ChatKnowledgeHistoryInput(Message, response.text, UserId, KnowledgeId)

        return true
    }
    else if(response && response.error) {
        console.log("OpenAI Error:", response)
        ChatKnowledgeInput(response.error, 999999, KnowledgeId)
        
        return true
    }
    else {
        return false
    }
}

export function ChatKnowledgeHistoryInput(question: string, answer: string, UserId: number, KnowledgeId: number) {
    console.log("ChatKnowledgeHistoryList", question, answer, UserId)
	const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)      
    const ChatKnowledgeHistoryList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : {}
    if(ChatKnowledgeHistoryList && ChatKnowledgeHistoryList[UserId] && ChatKnowledgeHistoryList[UserId][KnowledgeId]) {
        ChatKnowledgeHistoryList[UserId][KnowledgeId].push({
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChatKnowledgeHistoryList[UserId] = {}
        ChatKnowledgeHistoryList[UserId][KnowledgeId] = [{
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

export function ChatChatInput(Message: string, UserId: number, KnowledgeId: number) {
	const ChatChatText = window.localStorage.getItem(ChatChat)      
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList.push({
      "message": Message,
      "time": String(Date.now()),
      "senderId": UserId,
      "KnowledgeId": KnowledgeId,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatChat, JSON.stringify(ChatChatList))
}

export async function ChatChatOutput(Message: string, UserId: number, chatId: number, setLastMessage:any) {
    const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : []
    const History: any = []
    if(ChatChatList && ChatChatList[UserId] && ChatChatList[UserId][chatId]) {
        const ChatChatListLast10 = ChatChatList[UserId][chatId].slice(-10)
        ChatChatListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer.substring(0, 200)])
            }
        })
    }
    try {
        setLastMessage('')
        const response = await fetch(`${authConfig.backEndApi}/chat/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: Message, history: History }),
        });
        if (!response.body) {
          throw new Error('Response body is not readable as a stream');
        }
        const reader = response.body.getReader();
        let responseText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setLastMessage('')
            break;
          }
          const text = new TextDecoder('utf-8').decode(value);
          setLastMessage((prevText: string) => prevText + text);
          responseText = responseText + text;
        }
        if(responseText) {
            console.log("OpenAI Response:", responseText)
            ChatChatInput(responseText, 999999, chatId)
            ChatChatHistoryInput(Message, responseText, UserId, chatId)
    
            return true
        }
        else {
            return false
        }

    } catch (error: any) {
        console.log('Error:', error.message);
        
        return false
    }
      
    
    
    
}

export function ChatChatHistoryInput(question: string, answer: string, UserId: number, KnowledgeId: number) {
    console.log("ChatChatHistoryList", question, answer, UserId)
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList && ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][KnowledgeId]) {
        ChatChatHistoryList[UserId][KnowledgeId].push({
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChatChatHistoryList[UserId] = {}
        ChatChatHistoryList[UserId][KnowledgeId] = [{
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        }]
    }
    console.log("ChatChatHistoryList", ChatChatHistoryList)
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
