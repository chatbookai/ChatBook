import { useEffect, memo, Fragment } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import TextField2 from 'src/context/TextField2'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import authConfig from 'src/configs/auth'


const ConfigApp = (props: any) => {
    // ** Props
    const { app, setApp, handleEditDataSet, isDisabledButton, avatarFiles, setAvatarFiles } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    // Styled component for the upload image inside the dropzone area
    const Img = styled('img')(({ theme }) => ({
        [theme.breakpoints.up('md')]: {
            marginRight: theme.spacing(15.75)
        },
        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(4)
        },
        [theme.breakpoints.down('sm')]: {
            width: 38
        }
    }))

    const { getRootProps: getRootPropsAvatar, getInputProps: getInputPropsAvatar } = useDropzone({
        multiple: false,
        accept: {
        'image/*': ['.png', '.jpg', '.jpeg']
        },
        onDrop: (acceptedFiles: File[]) => {
            setAvatarFiles(acceptedFiles.map((file: File) => Object.assign(file)))
        }
    })

    return (
        <Fragment>
            <Grid sx={{ml: 4}}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Dataset")} ID</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <Typography variant='body1'>
                            {app._id}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Dataset")}{t("Avatar")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <Box {...getRootPropsAvatar({ className: 'dropzone' })} sx={{width: '38px', height: '38px', cursor: 'pointer'}}>
                                <input {...getInputPropsAvatar()} />
                                {avatarFiles && avatarFiles.length ? (
                                    <Box  sx={{ alignItems: 'center'}}>
                                        <Img alt={`${t(`Upload Avatar image`)}`} src={URL.createObjectURL(avatarFiles[0] as any)} sx={{width: '100%', borderRadius: '25px'}}/>
                                    </Box>
                                ) : (
                                    <Box sx={{alignItems: 'center'}}>
                                        <Img alt={`${t(`Upload Avatar image`)}`} src={authConfig.backEndApiChatBook + '/api/avatarfordataset/' + (app.avatar || authConfig.logo)} sx={{width: '100%', borderRadius: '25px'}}/>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} sx={{minWidth: '140px'}}>
                            <InputLabel sx={{pt: 6}}>{t("Name")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <TextField2
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
                            <TextField2
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
