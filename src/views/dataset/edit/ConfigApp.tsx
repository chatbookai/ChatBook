import { useEffect, memo, useState, Fragment } from 'react'

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
import Radio from '@mui/material/Radio'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';


const ConfigApp = (props: any) => {
    // ** Props
    const { app, setApp, handleEditDataSet, isDisabledButton, setIsDisabledButton } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    return (
        <Fragment>
            <Grid sx={{ml: 4}}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Dataset")} ID</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            {app._id}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Dataset")}{t("Avatar")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <Avatar variant="rounded" src='/icons/support/outlink/shareLight.svg' sx={{ width: '2.5rem', height: '2.5rem' }} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Name")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <TextField
                                size="small"
                                value={app.name}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(app.placeholder) as string}
                                onChange={(e: any) => {
                                  setApp( (prevState: any) => ({ ...prevState, name: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Vector Model")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            {app.vectorModel}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Single Data Deal Up Limit")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            {app.singleDataUpLimit}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("File Deal Model")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            {app.fileDealModel}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Intro")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <TextField
                                size="small"
                                multiline
                                rows={6}
                                value={app.intro}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(app.placeholder) as string}
                                onChange={(e: any) => {
                                  setApp( (prevState: any) => ({ ...prevState, intro: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Permission")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <RadioGroup row value={app.permission} name='simple-radio' aria-label='simple-radio' onClick={(e: any)=>{    
                                    if(e.target.value)   {
                                        setApp((prevState: any)=>({
                                            ...prevState,
                                            permission: e.target.value as string
                                        }))
                                    }
                                }} >
                                {['private','team'].map((item: any, index: number) => {

                                    return (<Tooltip key={index} title={t(item) as string}placement="top"><FormControlLabel value={item} control={<Radio />} label={t(item) as string} /></Tooltip>)
                                })}
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </Grid>


                <Grid item xs={12} sx={{mt: 5}}>
                    <Button sx={{mr: 3}} size="small" variant='contained' disabled={isDisabledButton} onClick={
                        () => { handleEditDataSet() }
                    }>
                    {t('Save')}
                    </Button>
                    <IconButton style={{width: '35px', height: '35px'}} color='primary' onClick={
                        () => { setApp( (prevState: any) => ({ ...prevState, openDelete: true }) ) }
                    }>
                        <Icon icon='mdi:delete-outline' />
                    </IconButton>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default memo(ConfigApp);
