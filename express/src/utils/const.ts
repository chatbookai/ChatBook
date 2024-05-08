export const DataDir = './data'

export const CONDENSE_TEMPLATE_INIT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`

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
Helpful answer in markdown:`

export const MenuListAdmin = [
  {
    title: 'Store',
    icon: 'tabler:apps-filled',
    path: '/store'
  },
  {
    title: 'Chat',
    icon: 'material-symbols:chat-outline',
    path: '/chat'
  },
  {
    sectionTitle: 'My App'
  },
  {
    title: 'App',
    icon: 'icon-park-outline:application-two',
    path: '/app/my'
  },
  {
    title: 'Dataset',
    icon: 'mdi:database',
    path: '/dataset/my'
  },
  {
    title: 'Account',
    icon: 'mdi:user-box-outline',
    path: '/user/account'
  },
  {
    sectionTitle: 'Settings'
  },
  {
    title: 'System',
    icon: 'mdi:settings-outline',
    path: '/system'
  }
]

export const MenuListUser = [
  {
    title: 'Store',
    icon: 'tabler:apps-filled',
    path: '/store'
  },
  {
    title: 'Chat',
    icon: 'material-symbols:chat-outline',
    path: '/chat'
  },
  {
    sectionTitle: 'My App'
  },
  {
    title: 'App',
    icon: 'icon-park-outline:application-two',
    path: '/app/my'
  },
  {
    title: 'Dataset',
    icon: 'mdi:database',
    path: '/dataset/my'
  },
  {
    title: 'Account',
    icon: 'mdi:user-box-outline',
    path: '/user/account'
  }
]
