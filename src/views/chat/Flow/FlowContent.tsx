// ** React Imports
import { useState, ReactNode, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}


const FlowContent = (props: any) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    llms,
    hidden,
    setActiveId,
    chatId
  } = props

  const [active, setActive] = useState<string>('')

  const handleChatClick = (id: string, name: string) => {
    setActiveId(id, name)
    setActive(id)
  }

  useEffect(() => {
    setActive(chatId)
  }, [chatId])

  return (
    <Fragment>
      <Box sx={{ height: `calc(100% - 4.125rem)`, width: '900px' }}>
      </Box>
    </Fragment>
  )
}

export default FlowContent
