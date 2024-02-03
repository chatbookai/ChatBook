// ** React Imports
import { ReactNode } from 'react'

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


const ChatLeft = (props: any) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    chatList,
    hidden,
    setActiveId
  } = props

  const handleChatClick = (id: number, name: string) => {
    setActiveId(id, name)
  }

  const renderChats = () => {
    if (chatList && chatList.length) {

      return chatList.map((Item: any, index: number) => {
        const activeCondition = false

        return (
          <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
            <ListItemButton
              disableRipple
              onClick={() => handleChatClick(index, Item)}
              sx={{
                px: 3,
                py: 2.5,
                width: '100%',
                borderRadius: 1,
                alignItems: 'flex-start',
                
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
                    src={"/images/avatars/"+((index%8)+1)+".png"}
                    alt={Item}
                    sx={{
                      width: 38,
                      height: 38,
                    }}
                  />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  my: 0,
                  ml: 4,
                  mr: 1.5,
                }}
                primary={
                  <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {Item}
                  </Typography>
                }
                secondary={
                  <Typography noWrap variant='body2' sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                    Summary
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
          <Box sx={{ display: 'flex', alignItems: 'center'}} >
            <Typography variant='h6' sx={{ ml: 3, mb: 1}}>
                {`${t('Chat')}`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(7, 3, 3) }}>
              <List sx={{ mb: 4, p: 0 }}>{renderChats()}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

    </div>
  )
}

export default ChatLeft
