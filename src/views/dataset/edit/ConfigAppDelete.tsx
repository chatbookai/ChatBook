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
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

const ConfigAppDelete = (props: any) => {
    // ** Props
    const {app, setApp, handleDeleteDataSet, isDisabledButton } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

  return (
    <Dialog fullWidth open={app.openDelete} onClose={
        () => { setApp( (prevState: any) => ({ ...prevState, openDelete: false }) ) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
                <Typography sx={{pl: 2}}>{t('Delete') as string} {t('Dataset') as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setApp( (prevState: any) => ({ ...prevState, openDelete: false }) ) }
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
                () => { setApp( (prevState: any) => ({ ...prevState, openDelete: false }) ) }
            }>
            {t("Cancel")}
            </Button>
            <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                () => { 
                    handleDeleteDataSet()
                }
            }>
            {t('Submit')}
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfigAppDelete
