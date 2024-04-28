import { useEffect, memo, Fragment } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'


import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'


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

const DataTypesList: any[] = [
    {
      type: 'File',
      avatar: '/imgs/module/extract.png',
      name: 'Local file',
      intro: 'Local file desc',
    },
    {
      type: 'Web',
      avatar: '/imgs/module/http.png',
      name: 'Web link',
      intro: 'Web link desc',
    },
    {
      type: 'Text',
      avatar: '/imgs/module/variable.png',
      name: 'Custom text',
      intro: 'Custom text',
    },
    {
      type: 'Table',
      avatar: '/imgs/module/db.png',
      name: 'Table collection',
      intro: 'Table collection',
    }
]

const CollectionNewEdit = (props: any) => {
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
        <Grid container sx={{m: 3, p: 3}}>
            <Grid item sx={{p: 1}} xs={12}>
                <Box display="flex" mb={1} alignItems="center">
                    <Typography sx={{pb: 1}}>{t('Dataset Type') as string}</Typography>
                    <span style={{ paddingTop: '10px', color: 'red', marginLeft: '3px' }}>*</span>
                </Box>
                <RadioGroup row value={pageData.type} name='simple-radio' aria-label='simple-radio' onClick={(e: any)=>{    
                        if(e.target.value)   {
                            setPageData((prevState: any)=>({
                                ...prevState,
                                type: e.target.value as string
                            }))
                        }
                    }} >
                    {DataTypesList.map((item: any, index: number) => {
                        return (<FormControlLabel value={item.type} control={<Radio />} label={t(item.name) as string} />)
                    })}
                </RadioGroup>
                
            </Grid>
            <Grid item sx={{pr: 3}} xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel id='demo-dialog-select-label'>{t("Name")}</InputLabel>
                    </Grid>
                    <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                        <TextField
                            size="small"
                            value={pageData.name}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t(pageData.placeholder) as string}
                            onChange={(e: any) => {
                                setPageData( (prevState: any) => ({ ...prevState, name: e.target.value }) )
                            }}
                            />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{pr: 3}} xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel id='demo-dialog-select-label'>{t("dataTotal")}</InputLabel>
                    </Grid>
                    <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                        <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: 0, max: 160000 }} 
                            value={pageData.dataTotal}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t(pageData.placeholder) as string}
                            onChange={(e: any) => {
                                setPageData( (prevState: any) => ({ ...prevState, dataTotal: e.target.value }) )
                            }}
                            />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{pr: 3}} xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel id='demo-dialog-select-label'>{t("status")}</InputLabel>
                    </Grid>
                    <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                        <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: 0, max: 100 }} 
                            value={pageData.status}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t(pageData.placeholder) as string}
                            onChange={(e: any) => {
                                setPageData( (prevState: any) => ({ ...prevState, status: e.target.value }) )
                            }}
                            />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{pr: 3}} xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel id='demo-dialog-select-label'>{t("expiredTime")}</InputLabel>
                    </Grid>
                    <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                        <TextField
                            size="small"
                            value={pageData.expiredTime}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t(pageData.placeholder) as string}
                            onChange={(e: any) => {
                                setPageData( (prevState: any) => ({ ...prevState, expiredTime: e.target.value }) )
                            }}
                            />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{pr: 3}} xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel id='demo-dialog-select-label'>{t("updateTime")}</InputLabel>
                    </Grid>
                    <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                        <Switch 
                            checked={pageData.updateTime == 1 ? true : false} 
                            onChange={(e: any) => {
                                setPageData( (prevState: any) => ({ ...prevState, updateTime: e.target.checked ? 1 : 0 }) )
                            }} 
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{pr: 3, justifyContent: 'flex-end'}} xs={12}>
                <Button size="small" variant='outlined' sx={{mr: 3}} disabled={isDisabledButton} onClick={
                    () => { setPageData( (prevState: any) => ({ ...prevState, openEdit: false }) ) }
                }>
                {t("Cancel")}
                </Button>
                <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                    () => { handleSubmit() }
                }>
                {t(pageData.FormSubmit)}
                </Button>
            </Grid>
        </Grid>
    );
};

export default memo(CollectionNewEdit);

/*

                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("authCheck")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.authCheck}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.placeholder) as string}
                                onChange={(e: any) => {
                                  setPageData( (prevState: any) => ({ ...prevState, authCheck: e.target.value }) )
                                }}
                              />
                        </Grid>
                    </Grid>
                </Grid>
*/