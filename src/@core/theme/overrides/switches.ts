// ** Type Import
import { OwnerStateThemeType } from './'

const Switch = () => {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiSwitch-track': {
            backgroundColor: `rgb(${theme.palette.customColors.main})`
          }
        })
      }
    }
  }
}

export default Switch
