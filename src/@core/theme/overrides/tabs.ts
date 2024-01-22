// ** Type Import
import { OwnerStateThemeType } from './'

const Tabs = () => {
  return {
    MuiTabs: {
      styleOverrides: {
        vertical: ({ theme }: OwnerStateThemeType) => ({
          minWidth: 130,
          marginRight: theme.spacing(4),
          borderRight: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            minWidth: 130
          }
        })
      }
    },
    MuiTab: {
      styleOverrides: {
        textColorSecondary: ({ theme }: OwnerStateThemeType) => ({
          '&.Mui-selected': {
            color: theme.palette.text.secondary
          }
        })
      }
    }
  }
}

export default Tabs
