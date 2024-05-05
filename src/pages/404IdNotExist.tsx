
// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('lg')]: {
    height: 400,
    marginTop: theme.spacing(5)
  },
  [theme.breakpoints.down('md')]: {
    height: 350
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(5)
  }
}))

const Error404 = (props: any) => {
    const { id, module } = props
    const { t } = useTranslation()

    return (
        <Box className='content-center'>
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <BoxWrapper>
                <Typography variant='h1'>404</Typography>
                <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
                    {t('Id Not Found')} ⚠️
                </Typography>
                <Typography variant='body1'>{t("We couldn't find this id you are looking for.")}</Typography>
                <Typography variant='body2' sx={{pt: 2}}>Id: {id}</Typography>
                <Typography variant='body2' sx={{pt: 2}}>{t('Module')}: {module}</Typography>
                <Img src='/images/pages/404.png' sx={{height: '300px'}} />
                </BoxWrapper>
                <Button href='/' component={Link} variant='contained' sx={{ px: 5.5 }}>
                {t('Back to Home')}
                </Button>
            </Box>
        </Box>
    )
}

export default Error404
