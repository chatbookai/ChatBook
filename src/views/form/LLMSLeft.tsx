// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

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


const LLMSLeft = (props: any) => {
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

  const renderChats = () => {
      return llms.map((Item: any, index: number) => {
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
                  <MuiAvatar
                    src={Item.avatar}
                    alt={Item.name}
                    sx={{
                      width: 38,
                      height: 38,
                      ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                    }}
                  />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  my: 0,
                  ml: 4,
                  mr: 1.5,
                  ...(activeCondition && { '& .MuiTypography-root': { color: 'common.white' } })
                }}
                primary={
                  <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {Item.name}
                  </Typography>
                }
                secondary={
                  <Typography noWrap variant='body2' sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                    {Item.summary}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )
      })
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
            width: 270,
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
            py: 3.125,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ ml: 3, mb: 1}}>
            {`${t('Chat')}`}
          </Typography>
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(7, 3, 3) }}>
              <List sx={{ mb: 4, p: 0 }}>{llms ? renderChats() : null}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>
    </div>
  )
}

export default LLMSLeft
