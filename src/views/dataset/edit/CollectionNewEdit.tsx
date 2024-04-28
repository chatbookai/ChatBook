import { useEffect, memo, Fragment, useState } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'


import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import StepperCustomDot from './StepperCustomDot'
import StepperWrapper from 'src/@core/styles/mui/stepper'


import Radio from '@mui/material/Radio'
import Divider from '@mui/material/Divider'
import RadioGroup from '@mui/material/RadioGroup'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
      name: 'Local file',
      intro: 'Local file desc',
    },
    {
      type: 'Web',
      name: 'Web link',
      intro: 'Web link desc',
    },
    {
      type: 'Text',
      name: 'Custom text',
      intro: 'Custom text',
    },
    {
      type: 'Table',
      name: 'Table collection',
      intro: 'Table collection',
    }
]

const steps = [
    {
      title: 'Select Files',
      subtitle: 'Select Files'
    },
    {
      title: 'Data Deal',
      subtitle: 'Data Deal'
    },
    {
      title: 'Upload Data',
      subtitle: 'Upload Data'
    }
]

const CollectionNewEdit = (props: any) => {
    // ** Props
    const {pageData, setPageData, handleSubmit, isDisabledButton } = props
    const [activeStep, setActiveStep] = useState<number>(0)

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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={{pb: 1}}>{t('Dataset Type') as string}</Typography>
                    <Button sx={{mr: 3}} size="small" variant='outlined' disabled={isDisabledButton} onClick={() => { setPageData( (prevState: any) => ({ ...prevState, openEdit: false }) ) }}>
                        {t("Cancel")}
                    </Button>
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
            <Grid item sx={{p: 1, mr: 3, pl: 0}} xs={12}>
                <Card>
                    <CardContent sx={{}}>
                        <StepperWrapper>
                        <Stepper activeStep={activeStep}>
                            {steps.map((step, index) => {
                                return (
                                    <Step key={index}>
                                        <StepLabel StepIconComponent={StepperCustomDot}>
                                            <div className='step-label'>
                                            <Typography className='step-number'>{`${index + 1}`}</Typography>
                                            <div>
                                                <Typography className='step-title'>{t(step.title)}</Typography>
                                            </div>
                                            </div>
                                        </StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>
                        </StepperWrapper>
                    </CardContent>
                </Card>
            </Grid>

            <Divider sx={{ m: '0 !important' }} />
            
            {pageData.type == 'Text' ?
            <Fragment>
                <Grid item sx={{pr: 3}} xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={3} sx={{pt: 4}}>
                            <InputLabel id='demo-dialog-select-label'>{t("Collection Name")}</InputLabel>
                        </Grid>
                        <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.name}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.name) as string}
                                onChange={(e: any) => {
                                    setPageData( (prevState: any) => ({ ...prevState, name: e.target.value }) )
                                }}
                                />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{pr: 3}} xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={3} sx={{pt: 4}}>
                            <InputLabel id='demo-dialog-select-label'>{t("Collection Content")}</InputLabel>
                        </Grid>
                        <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                            <TextField
                                multiline
                                fullWidth
                                rows={9}
                                size="small"
                                value={pageData.name}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(pageData.name) as string}
                                onChange={(e: any) => {
                                    setPageData( (prevState: any) => ({ ...prevState, data: e.target.value }) )
                                }}
                                />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{mt: 4, pr: 3, justifyContent: 'flex-end'}} xs={12}>
                    <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                        () => { handleSubmit() }
                    }>
                    {t("Next")}
                    </Button>
                </Grid>
            </Fragment>
            :
            null
            }

            
        </Grid>
    );
};

export default memo(CollectionNewEdit);
