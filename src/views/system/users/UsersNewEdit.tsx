import { useEffect, memo } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

const UsersNewEdit = (props: any) => {
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
        <Dialog fullWidth open={pageData.openEdit} onClose={
            () => { setPageData( (prevState: any) => ({ ...prevState, openEdit: false }) ) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Avatar src={pageData.FormTitleIcon} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                    <Typography sx={{pl: 2}}>{t(pageData.FormTitle) as string}</Typography>
                    <Box position={'absolute'} right={'5px'} top={'1px'}>
                        <IconButton size="small" edge="end" onClick={
                            () => { setPageData( (prevState: any) => ({ ...prevState, openEdit: false }) ) }
                        } aria-label="close">
                        <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent sx={{  }}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Email")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.email}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, email: e.target.value }) )
                                }}
                                disabled={pageData.FormAction=='edituser'}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Username")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.username}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, username: e.target.value }) )
                                }}
                                disabled={pageData.FormAction=='edituser'}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("First name")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                type="text"
                                size="small"
                                inputProps={{ min: 0, max: 100 }} 
                                value={pageData.firstname}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, firstname: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Last name")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                type="text"
                                size="small"
                                inputProps={{ min: 0, max: 160000 }} 
                                value={pageData.lastname}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, lastname: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Organization")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.organization}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, organization: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Mobile")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.mobile}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, mobile: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Address")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.address}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, address: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("State")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.state}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, state: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label' sx={{pt:5}}>{t("Country")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 4, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.country}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, country: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button size="small" variant='outlined' disabled={isDisabledButton} onClick={
                    () => { setPageData( (prevState: any) => ({ ...prevState, openEdit: false }) ) }
                }>
                {t("Close")}
                </Button>
                <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                    () => { handleSubmit() }
                }>
                {t(pageData.FormSubmit)}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(UsersNewEdit);
