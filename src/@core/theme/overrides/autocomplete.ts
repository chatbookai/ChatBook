// ** Type Imports
import { OwnerStateThemeType } from './'
import { Skin } from 'src/@core/layouts/types'

const Autocomplete = (skin: Skin) => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: ({ theme }: OwnerStateThemeType) => ({
          ...(skin === 'bordered' && { boxShadow: 'none', border: `1px solid ${theme.palette.divider}` })
        })
      }
    }
  }
}

export default Autocomplete
