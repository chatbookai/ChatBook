// ** MUI Imports
import { lighten, darken } from '@mui/material/styles'

// ** Type Import
import { OwnerStateThemeType } from './'
import { Mode } from 'src/@core/layouts/types'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Alert = (mode: Mode) => {
  const getColor = mode === 'dark' ? lighten : darken

  return {
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          borderRadius: 5,
          '& .MuiAlertTitle-root': {
            marginBottom: theme.spacing(1.6)
          },
          '& a': {
            fontWeight: 500,
            color: 'inherit'
          }
        }),
        standardSuccess: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.success.main, 0.12),
          backgroundColor: hexToRGBA(theme.palette.success.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.success.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.success.main, 0.12)
          }
        }),
        standardInfo: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.info.main, 0.12),
          backgroundColor: hexToRGBA(theme.palette.info.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.info.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.info.main, 0.12)
          }
        }),
        standardWarning: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.warning.main, 0.12),
          backgroundColor: hexToRGBA(theme.palette.warning.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.warning.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.warning.main, 0.12)
          }
        }),
        standardError: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.error.main, 0.12),
          backgroundColor: hexToRGBA(theme.palette.error.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.error.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.error.main, 0.12)
          }
        }),
        outlinedSuccess: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.success.main,
          color: getColor(theme.palette.success.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.success.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.success.main, 0.12)
          }
        }),
        outlinedInfo: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.info.main,
          color: getColor(theme.palette.info.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.info.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.info.main, 0.12)
          }
        }),
        outlinedWarning: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.warning.main,
          color: getColor(theme.palette.warning.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.warning.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.warning.main, 0.12)
          }
        }),
        outlinedError: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.error.main,
          color: getColor(theme.palette.error.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.error.main, 0.12)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.error.main, 0.12)
          }
        }),
        filled: ({ theme }: OwnerStateThemeType) => ({
          fontWeight: 400,
          color: theme.palette.common.white
        })
      }
    }
  }
}

export default Alert
