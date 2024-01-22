// ** Type Import
import { OwnerStateThemeType } from './'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Pagination = () => {
  return {
    MuiPaginationItem: {
      styleOverrides: {
        outlined: ({ theme }: OwnerStateThemeType) => ({
          borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`
        }),
        outlinedPrimary: ({ theme }: OwnerStateThemeType) => ({
          '&.Mui-selected': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12),
            '&:hover': {
              backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.2)} !important`
            }
          }
        }),
        outlinedSecondary: ({ theme }: OwnerStateThemeType) => ({
          '&.Mui-selected': {
            backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.12),
            '&:hover': {
              backgroundColor: `${hexToRGBA(theme.palette.secondary.main, 0.2)} !important`
            }
          }
        })
      }
    }
  }
}

export default Pagination
