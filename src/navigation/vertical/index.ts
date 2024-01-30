// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

const MenuListAdmin = [
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
    title: 'Logs',
    icon: 'mdi:web-sync',
    path: '/logs'
  }
]

const MenuListUser = [
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

const navigation = (): VerticalNavItemsType => {
  
  let MenuList = []
  const auth = useAuth()
  if(auth && auth.user && auth.user.role && auth.user.role == 'admin') {
    MenuList = MenuListAdmin
  }
  else {
    MenuList = MenuListUser
  }
  
  // @ts-ignore
  return MenuList
}

export default navigation
