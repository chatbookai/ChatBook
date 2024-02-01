// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  const { user, logout } = useAuth()

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { t } = useTranslation()
  
  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/api/initDatabase')
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get(authConfig.backEndApi + '/api/parsefiles')
    }, 3600000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      {
        user?.username ?
        <Fragment>
          <Badge
            overlap='circular'
            onClick={handleDropdownOpen}
            sx={{ ml: 2, cursor: 'pointer' }}
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            <Avatar
              alt='John Doe'
              onClick={handleDropdownOpen}
              sx={{ width: 40, height: 40 }}
              src='/images/avatars/1.png'
            />
          </Badge>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleDropdownClose()}
            sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
          >
            <Box sx={{ pt: 2, pb: 3, px: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  overlap='circular'
                  badgeContent={<BadgeContentSpan />}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
                </Badge>
                <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography sx={{ 'maxWidth': '15ch', 'overflow': 'hidden', 'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'fontWeight': 600 }}>{user?.username}</Typography>
                  <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mt: '0 !important' }} />
            <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/user/account')}>
              <Box sx={styles}>
                <Icon icon='mdi:cog-outline' />
                {t('Settings') as string}
              </Box>
            </MenuItem>
            <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/faq')}>
              <Box sx={styles}>
                <Icon icon='mdi:help-circle-outline' />
                {t('FAQ') as string}                
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
            >
              <Icon icon='mdi:logout-variant' />
              {t('Logout') as string}  
            </MenuItem>
          </Menu>
        </Fragment>
        :
        null
      }
    </Fragment>
  )
}

/*
<MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/faq')}>
  <Box sx={styles}>
    <Icon icon='mdi:help-circle-outline' />
    {`${t(`FAQ`)}`}
  </Box>
</MenuItem>
*/
export default UserDropdown
