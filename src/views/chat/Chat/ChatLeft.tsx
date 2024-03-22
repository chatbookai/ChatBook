// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import OptionsMenu from 'src/@core/components/option-menu'
import Icon from 'src/@core/components/icon'

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
    llms,
    hidden,
    setActiveId,
    chatId,
    deleteUserAgent
  } = props

  const [active, setActive] = useState<string>('')

  const handleChatClick = (id: string, name: string, agent: any) => {
    setActiveId(id, name, agent)
    setActive(id)
  }

  useEffect(() => {
    setActive(chatId)
  }, [chatId])

  const renderChats = () => {
      const [selectedItem, setSelectedItem] = useState<string>("")

      return llms.map((Item: any, index: number) => {
        const activeCondition = active === Item.id
        console.log("active", active)
        console.log("activeCondition", activeCondition)
        const OptionMenulist = ['Cancel']

        return (
          <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
            <ListItemButton
              disableRipple
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
              <ListItemAvatar sx={{ m: 0 }} onClick={() => handleChatClick(Item.id, Item.title, Item)} >
                  <MuiAvatar
                    src={Item.avatar? Item.avatar : '/images/avatars/1.png'}
                    alt={Item.title}
                    sx={{
                      width: 38,
                      height: 38,
                      ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                    }}
                  />
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
                    {Item.title}
                  </Typography>
                }
                secondary={
                  <Typography noWrap variant='body2' sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                    {Item.model}
                  </Typography>
                }
                onClick={() => handleChatClick(Item.id, Item.title, Item)}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OptionsMenu
                  menuProps={{ sx: { mt: 2 } }}
                  icon={<Icon icon='mdi:dots-vertical' fontSize='1.25rem' />}
                  iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                  options={
                    OptionMenulist.map((optionValue: string)=>{
                      return {
                        text: optionValue,
                        menuItemProps: {
                          sx: { py: 2 },
                          selected: selectedItem === optionValue,
                          onClick: () => {
                            console.log("item", optionValue)
                            setSelectedItem(optionValue)
                            if(optionValue == "Cancel") {
                              deleteUserAgent()
                            }
                          }
                        }
                      }
                    })}
                />
              </Box>
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
            py: 3.6,
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

export default ChatLeft
