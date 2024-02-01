
export const DataDir = "./data"

export const CONDENSE_TEMPLATE_INIT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

export const QA_TEMPLATE_INIT = `You are an expert researcher. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
Helpful answer in markdown:`;

export const MenuListAdmin = [
  {
    sectionTitle: 'Chat'
  },
  {
    title: 'Chat',
    icon: 'mdi:message-outline',
    path: '/chat/chat'
  },
  {
    title: 'Knowledge Chat',
    icon: 'material-symbols:chat',
    path: '/chat/knowledge'
  },
  {
    sectionTitle: 'Settings'
  },
  {
    title: 'Knowledge Base',
    icon: 'carbon:ibm-watson-knowledge-studio',
    path: '/knowledge'
  },
  {
    title: 'Settings',
    icon: 'mingcute:openai-fill',
    path: '/settings'
  },
  {
    title: 'Template',
    icon: 'tabler:template',
    path: '/template'
  },
  {
    title: 'Upload Files',
    icon: 'material-symbols:backup',
    path: '/upload'
  },
  {
    title: 'File Parse Process',
    icon: 'clarity:process-on-vm-line',
    path: '/files'
  },
  {
    title: 'Chat Setting',
    icon: 'mingcute:openai-fill',
    path: '/settings/llms'
  },
  {
    title: 'User Manage',
    icon: 'mdi:users',
    path: '/settings/users'
  },
  {
    title: 'User Logs',
    icon: 'icon-park-outline:upload-logs',
    path: '/settings/userlogs'
  },
  {
    title: 'System Logs',
    icon: 'mdi:web-sync',
    path: '/logs'
  }
]

export const MenuListUser = [
  {
    sectionTitle: 'Chat'
  },
  {
    title: 'Chat',
    icon: 'mdi:message-outline',
    path: '/chat/chat'
  },
  {
    title: 'Knowledge Chat',
    icon: 'material-symbols:chat',
    path: '/chat/knowledge'
  }
]