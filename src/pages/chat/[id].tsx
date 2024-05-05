import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ChatAnonymous from 'src/views/app/chat/ChatAnonymous';

const ChatAnonymousApp = () => {

  return <ChatAnonymous />

}

ChatAnonymousApp.contentHeightFixed = true
ChatAnonymousApp.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ChatAnonymousApp

