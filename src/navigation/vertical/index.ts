// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const MenuList = [
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
    title: 'Chat Settings',
    icon: 'mingcute:openai-fill',
    path: '/settings/llms'
  },
  {
    title: 'Logs',
    icon: 'mdi:web-sync',
    path: '/logs'
  }
]

const navigation = (): VerticalNavItemsType => {
  // @ts-ignore
  return MenuList
}

export default navigation
