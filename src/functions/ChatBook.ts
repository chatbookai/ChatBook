import axios from 'axios'
import authConfig from 'src/configs/auth'

const ChatBook = "ChatBook"
const ChatBookLanguage = "ChatBookLanguage"
const ChatBookHistory = "ChatBookHistory"

export function ChatBookInit(MsgList: any) {
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
    window.localStorage.setItem(ChatBook, JSON.stringify(ChatLogList))

    return ChatLogList
}

export function ChatBookInput(Message: string, UserId: number, KnowledgeId: number) {
	const ChatBookText = window.localStorage.getItem(ChatBook)      
    const ChatBookList = ChatBookText ? JSON.parse(ChatBookText) : []
    ChatBookList.push({
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
    window.localStorage.setItem(ChatBook, JSON.stringify(ChatBookList))
}

export async function ChatBookOutput(Message: string, UserId: number, KnowledgeId: number) {
    const ChatBookHistoryText = window.localStorage.getItem(ChatBookHistory)      
    const ChatBookList = ChatBookHistoryText ? JSON.parse(ChatBookHistoryText) : []
    const History: any = []
    if(ChatBookList && ChatBookList[UserId] && ChatBookList[UserId][KnowledgeId]) {
        const ChatBookListLast10 = ChatBookList[UserId][KnowledgeId].slice(-10)
        ChatBookListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer.substring(0, 200)])
            }
        })
    }
    const response: any = await axios.post(authConfig.backEndApi + "/chat", { question: Message, history: History, KnowledgeId: KnowledgeId }).then((res) => res.data)
    if(response && response.text) {
        console.log("OpenAI Response:", response)
        ChatBookInput(response.text, 999999, KnowledgeId)
        ChatBookHistoryInput(Message, response.text, UserId, KnowledgeId)

        return true
    }
    else if(response && response.error) {
        console.log("OpenAI Error:", response)
        ChatBookInput(response.error, 999999, KnowledgeId)
        
        return true
    }
    else {
        return false
    }
}

export function ChatBookHistoryInput(question: string, answer: string, UserId: number, KnowledgeId: number) {
    console.log("ChatBookHistoryList", question, answer, UserId)
	const ChatBookHistoryText = window.localStorage.getItem(ChatBookHistory)      
    const ChatBookHistoryList = ChatBookHistoryText ? JSON.parse(ChatBookHistoryText) : {}
    if(ChatBookHistoryList && ChatBookHistoryList[UserId] && ChatBookHistoryList[UserId][KnowledgeId]) {
        ChatBookHistoryList[UserId][KnowledgeId].push({
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChatBookHistoryList[UserId] = {}
        ChatBookHistoryList[UserId][KnowledgeId] = [{
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        }]
    }
    console.log("ChatBookHistoryList", ChatBookHistoryList)
    window.localStorage.setItem(ChatBookHistory, JSON.stringify(ChatBookHistoryList))
}

export function getChatBookLanguage() {
    const ChatBookLanguageValue = window.localStorage.getItem(ChatBookLanguage) || "en"

    return ChatBookLanguageValue
};

export function setChatBookLanguage(Language: string) {
    window.localStorage.setItem(ChatBookLanguage, Language)

    return true
};
