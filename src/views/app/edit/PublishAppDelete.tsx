// ** React Imports
import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

const PublishAppDelete = (props: any) => {
    // ** Props
    const {pageData, setPageData, handleSubmit, isDisabledButton } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

  return (
    <Dialog fullWidth open={pageData.openDelete} onClose={
        () => { setPageData( (prevState: any) => ({ ...prevState, openDelete: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Avatar src={pageData.FormTitleIcon} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                <Typography sx={{pl: 2}}>{t(pageData.FormTitle) as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setPageData( (prevState: any) => ({ ...prevState, openDelete: false }) ) }
                    } aria-label="close">
                    <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('Do you want to delete this record')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button size="small" variant='outlined' disabled={isDisabledButton} onClick={
                () => { setPageData( (prevState: any) => ({ ...prevState, openDelete: false }) ) }
            }>
            {t("Cancel")}
            </Button>
            <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                () => { 
                    setPageData( (prevState: any) => ({ ...prevState, FormAction: 'deletepublish' }) )
                    handleSubmit()
                    }
            }>
            {t(pageData.FormSubmit)}
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default PublishAppDelete
