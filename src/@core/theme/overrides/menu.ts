// ** Type Imports
import { OwnerStateThemeType } from './'
import { Skin } from 'src/@core/layouts/types'

const Menu = (skin: Skin) => {
  const boxShadow = (theme: OwnerStateThemeType['theme']) => {
    if (skin === 'bordered') {
      return theme.shadows[0]
    } else if (theme.palette.mode === 'light') {
      return theme.shadows[8]
    } else return theme.shadows[9]
  }

  return {
    MuiMenu: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiMenu-paper': {
            borderRadius: 5,
            boxShadow: boxShadow(theme),
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }
        })
      }
    }
  }
}

export default Menu
