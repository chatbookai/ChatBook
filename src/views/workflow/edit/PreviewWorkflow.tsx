// ** React Imports
import { useState, useEffect, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import Avatar from '@mui/material/Avatar'
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

/*
"External": "外部使用",
        "Flow mode": "高级编排",
        "Publish": "发布",
        "Publish app": "发布应用",
        "Simple mode": "简易配置"
        */
const WorkflowMenuList = [
          {id: 1, name: '简易配置', avatar: '/icons/core/modules/basicNode.svg'},
          {id: 2, name: '高级编排', avatar: '/icons/core/modules/systemPlugin.svg'},
          {id: 3, name: '发布应用', avatar: '/icons/support/outlink/shareLight.svg'},
          {id: 4, name: '对话日志', avatar: '/icons/core/app/logsLight.svg'},
          {id: 5, name: '立即对话', avatar: '/icons/core/chat/chatLight.svg'}
          ]

const PreviewWorkflow = (props: any) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    workflow,
    hidden
  } = props

  const [active, setActive] = useState<number | null>(1)

  const handleChatClick = (id: number, name: string) => {
    setActive(id)
  }

  const renderChats = () => {
    if (WorkflowMenuList && WorkflowMenuList.length) {
      const arrToMap = WorkflowMenuList

      return arrToMap.map((Item: any, index: number) => {
        const activeCondition = active === Item.id

        return (
          <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
            <ListItemButton
              disableRipple
              onClick={() => handleChatClick(Item.id, Item.name)}
              sx={{
                px: 3,
                py: 2.5,
                width: '100%',
                borderRadius: 1,
                alignItems: 'flex-start',
                ...(activeCondition && {
                  backgroundImage: theme =>
                    `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
                })
              }}
            >
              <ListItemAvatar sx={{ m: 0 }}>
                <Badge
                  overlap='circular'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  badgeContent={
                    <Box
                      component='span'
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        color: `primary.main`,
                        backgroundColor: `secondary.main`,
                        boxShadow: theme =>
                          `0 0 0 2px ${
                            !activeCondition ? theme.palette.background.paper : theme.palette.common.white
                          }`
                      }}
                    />
                  }
                >
                  <Avatar
                    src={Item.avatar}
                    alt={Item.name}
                    sx={{
                      width: 30,
                      height: 30,
                      ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                    }}
                  />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  ml: 4,
                  mr: 1.5,
                }}
                primary={
                  <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {t(Item.name)}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )
      })
    }
  }

  return (
    <div>
      <Drawer
        open={true}
        variant={'permanent'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: 'static',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: 300,
            position:'static',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            px: 5,
            py: 3.6,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ ml: 3, mb: 1}}>
            {`${t(workflow?.name)}`}
          </Typography>
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
        </Box>
      </Drawer>

    </div>
  )
}

export default PreviewWorkflow
