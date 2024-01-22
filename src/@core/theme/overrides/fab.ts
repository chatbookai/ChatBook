import { OwnerStateThemeType } from './'

const FabButton = () => {
  return {
    MuiFab: {
      styleOverrides: {
        default: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.primary
        })
      }
    }
  }
}

export default FabButton
