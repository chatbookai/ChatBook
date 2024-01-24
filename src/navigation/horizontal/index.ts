// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Chat',
      icon: 'mdi:message-outline',
      path: '/chat/knowledge'
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
      title: 'Logs',
      icon: 'mdi:web-sync',
      path: '/logs'
    }
  ]
}

export default navigation
