// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'

const CustomRadioIconsType = (props: any) => {
  // ** Props
  const { data, selected, gridProps, handleChange, color = 'primary' } = props

  const { value, icon } = data
  const { t } = useTranslation()

  const renderData = () => {
    if (value && icon) {
      return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              pl: 2,
              pt: 0.5,
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ mr: 2, fontWeight: 500 }}>{t(value) as string}</Typography>
          </Box>
        </Box>
      )
    }
    else {
      return null
    }
  }

  const iconProps = { fontSize: '2rem' }

  const renderComponent = () => {
    return (
      <Grid item {...gridProps}>
        <Box
          onClick={() => handleChange(value)}
          sx={{
            p: 4,
            py: 2,
            height: '100%',
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'flex-start',
            border: (theme: any) => `1px solid ${theme.palette.divider}`,
            ...(selected === value
              ? { borderColor: `${color}.main` }
              : { '&:hover': { borderColor: (theme: any) => `rgba(${theme.palette.customColors.main}, 0.25)` } })
          }}
        >
          <Icon icon={icon} {...iconProps} />
          {renderData()}
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}

export default CustomRadioIconsType
