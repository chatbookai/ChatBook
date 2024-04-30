// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}


const AppMenuList = [
          {id: 1, path: 'collection', name: '数据集', avatar: '/icons/core/modules/basicNode.svg'},
          {id: 2, path: 'searchtest', name: '搜索测试', avatar: '/icons/core/modules/systemPlugin.svg'},
          {id: 3, path: 'config', name: '配置', avatar: '/icons/support/outlink/shareLight.svg'}
          ]

const LeftApp = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()

  // ** Props
  const { app, hidden, menuid } = props

  const active = menuid

  const handleMenuClick = (path: string) => {
    router.push(`/dataset/${path}/${app._id}`)
  }

  const renderChats = () => {
    if (AppMenuList && AppMenuList.length) {
      const arrToMap = AppMenuList

      return arrToMap.map((Item: any, index: number) => {
        const activeCondition = active === Item.path

        return (
          <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
            <ListItemButton
              disableRipple
              onClick={() => handleMenuClick(Item.path)}
              sx={{
                px: 3,
                pb: 2.5,
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
    <Box sx={{ height: `calc(100% - 1.125rem)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <ScrollWrapper hidden={hidden}>
        <Box sx={{ p: theme => theme.spacing(3, 3, 3) }}>
          <List sx={{ mb: 4, p: 0 }}>{renderChats()}</List>
        </Box>
      </ScrollWrapper>
      <Button variant="contained" color="primary" sx={{ m: 0 }} onClick={()=>router.push('/dataset/my')}>
        {t('My Dataset')}
      </Button>
    </Box>
  )
}

export default LeftApp
