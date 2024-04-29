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
import Icon from 'src/@core/components/icon'
import RadioGroup from '@mui/material/RadioGroup'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'


// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DataTypesList:any[] = [
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

const TrainingModeList: any[] = [
    {
      type: 'Chunk Split',
      name: 'Chunk Split',
      intro: 'Chunk Split Tip',
    },
    {
      type: 'QA Import',
      name: 'QA Import',
      intro: 'QA Import Tip',
    },
    {
      type: 'Auto mode',
      name: 'Auto mode',
      intro: 'Auto mode Tip',
    }
]

const ProcessWayList: any[] = [
    {
      type: 'Auto process',
      name: 'Auto process',
      intro: 'Auto process desc',
    },
    {
      type: 'Custom process',
      name: 'Custom process',
      intro: 'Custom process desc',
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

const nl2br = (tooltipText: string) => {
    const formattedText = tooltipText.split('\n').map((line, index, array) => (
        <Fragment key={index}>
          {line}{index < array.length - 1 && <br />}
        </Fragment>
      ))

    return formattedText
}

const rows = [
    { name: 'John'},
  ];


const CollectionNewEdit = (props: any) => {
    // ** Props
    const {pageData, setPageData, handleSubmit, isDisabledButton } = props
    const [activeStep, setActiveStep] = useState<number>(0)
    const bgColors: UseBgColorType = useBgColor()

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
                            setActiveStep(0)
                        }
                    }} >
                    {DataTypesList.map((item: any, index: number) => {
                        return (<Tooltip title={nl2br(t(item.intro) as string)}placement="top"><FormControlLabel value={item.type} control={<Radio />} label={t(item.name) as string} /></Tooltip>)
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
            
            {pageData.type == 'Text' && activeStep == 0 ?
            <Fragment>
                <Grid item sx={{pr: 3}} xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={3} sx={{pt: 4}}>
                            <InputLabel id='demo-dialog-select-label'>{t("Collection Name")}</InputLabel>
                        </Grid>
                        <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.CollectionName}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t("Collection Name") as string}
                                onChange={(e: any) => {
                                    setPageData( (prevState: any) => ({ ...prevState, CollectionName: e.target.value }) )
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
                                value={pageData.CollectionContent}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t("Collection Content") as string}
                                onChange={(e: any) => {
                                    setPageData( (prevState: any) => ({ ...prevState, CollectionContent: e.target.value }) )
                                }}
                                />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{mt: 4, pr: 3, justifyContent: 'flex-end'}} xs={12}>
                    <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                        () => { setActiveStep(1) }
                    }>
                    {t("Next")}
                    </Button>
                </Grid>
            </Fragment>
            :
            null
            }

            {pageData.type == 'Web' && activeStep == 0 ?
            <Fragment>
            <Grid item sx={{pr: 3}} xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={3} sx={{pt: 4}}>
                        <InputLabel id='demo-dialog-select-label'>{t("Link name")}</InputLabel>
                    </Grid>
                    <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                        <TextField
                            multiline
                            fullWidth
                            rows={9}
                            size="small"
                            value={pageData.LinkName}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t("Link name placeholder") as string}
                            onChange={(e: any) => {
                                setPageData( (prevState: any) => ({ ...prevState, LinkName: e.target.value }) )
                            }}
                            />
                    </Grid>
                </Grid>
            </Grid>
                <Grid item sx={{pr: 3}} xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={3} sx={{pt: 4}}>
                            <InputLabel id='demo-dialog-select-label'>{t("Selector")}</InputLabel>
                        </Grid>
                        <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                            <TextField
                                size="small"
                                value={pageData.Selector}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={'body .content #document'}
                                onChange={(e: any) => {
                                    setPageData( (prevState: any) => ({ ...prevState, Selector: e.target.value }) )
                                }}
                                />
                            <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, flexWrap: 'wrap' }}>
                                {pageData.LinkName && pageData.LinkName.trim().split('\n').map((item: string, index: number)=>{    
                                    return (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mr: 1, pl: 1, pr: 3, py: 0, backgroundColor: bgColors.primaryLight.backgroundColor, borderRadius: '8px' }} key={index}>
                                                <Icon icon='ph:link-bold' style={{width: '18px'}}/>
                                                <Typography sx={{ pl: 1 }}>{item}</Typography>
                                                <IconButton style={{width: '35px', height: '35px'}} color='primary' onClick={()=>{
                                                    const LinkNameNew1 = pageData.LinkName.trim().split('\n').filter((_: string, indexNew: number)=>{ 

                                                        return indexNew != index
                                                    })
                                                    const LinkNameNew2 = LinkNameNew1.filter((itemNew: string)=>{ 
                                                        
                                                        return itemNew.toLowerCase().substring(0, 4) == 'http'
                                                    })
                                                    setPageData( (prevState: any) => ({ ...prevState, LinkName: LinkNameNew2.join('\n') }) )
                                                }}>
                                                    <Icon icon='mdi:delete-outline' />
                                                </IconButton>
                                            </Box>
                                        )
                                })}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{mt: 4, pr: 3, justifyContent: 'flex-end'}} xs={12}>
                    <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                        () => { setActiveStep(1) }
                    }>
                    {t("Next")}
                    </Button>
                </Grid>
            </Fragment>
            :
            null
            }

            {activeStep == 1 ?
            <Fragment>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Grid container spacing={2}>
                            <Grid item sx={{pr: 3}} xs={12}>
                                <Grid container alignItems="center">
                                    <Grid item xs={3} sx={{pt: 4}}>
                                        <InputLabel id='demo-dialog-select-label'>{t("Training mode")}</InputLabel>
                                    </Grid>
                                    <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                                        <RadioGroup row value={pageData.trainingMode} name='simple-radio' aria-label='simple-radio' onClick={(e: any)=>{    
                                                if(e.target.value)   {
                                                    setPageData((prevState: any)=>({
                                                        ...prevState,
                                                        trainingMode: e.target.value as string
                                                    }))
                                                }
                                            }} >
                                            {TrainingModeList.map((item: any, index: number) => {
                                                return (<Tooltip title={nl2br(t(item.intro) as string)} placement="top"><FormControlLabel value={item.type} control={<Radio />} label={t(item.name) as string} /></Tooltip>)
                                            })}
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{pr: 3}} xs={12}>
                                <Grid container alignItems="center">
                                    <Grid item xs={3} sx={{pt: 4}}>
                                        <InputLabel id='demo-dialog-select-label'>{t("Process way")}</InputLabel>
                                    </Grid>
                                    <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                                        <RadioGroup row value={pageData.processWay} name='simple-radio' aria-label='simple-radio' onClick={(e: any)=>{    
                                                if(e.target.value)   {
                                                    setPageData((prevState: any)=>({
                                                        ...prevState,
                                                        processWay: e.target.value as string
                                                    }))
                                                }
                                            }} >
                                            {ProcessWayList.map((item: any, index: number) => {
                                                return (<Tooltip title={nl2br(t(item.intro) as string)}placement="top"><FormControlLabel value={item.type} control={<Radio />} label={t(item.name) as string} /></Tooltip>)
                                            })}
                                        </RadioGroup>
                                        { pageData.processWay == 'Custom process' ?
                                        <Fragment>
                                            <Grid item sx={{pr: 3}} xs={12}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs={3} sx={{pt: 4}}>
                                                        <Tooltip title={nl2br(t("Ideal chunk length Tips") as string)} placement="top" arrow style={{ whiteSpace: 'pre-line' }}>
                                                            <InputLabel >{t("Ideal chunk length")}</InputLabel>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            value={pageData.IdealChunkLength}
                                                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                                            placeholder={t("Ideal chunk length Tips") as string}
                                                            onChange={(e: any) => {
                                                                setPageData( (prevState: any) => ({ ...prevState, IdealChunkLength: e.target.value }) )
                                                            }}
                                                            />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item sx={{pr: 3}} xs={12}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs={3} sx={{pt: 4}}>
                                                        <Tooltip title={nl2br(t("Custom split char Tips") as string)} placement="top" arrow style={{ whiteSpace: 'pre-line' }}>
                                                            <InputLabel >{t("Custom split char")}</InputLabel>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={9} sx={{pt: 6, pl: 2}}>
                                                        <TextField
                                                            size="small"
                                                            value={pageData.CustomSplitChar}
                                                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                                            placeholder={t("Custom split char Tips") as string}
                                                            onChange={(e: any) => {
                                                                setPageData( (prevState: any) => ({ ...prevState, CustomSplitChar: e.target.value }) )
                                                            }}
                                                            />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Fragment>
                                        :
                                        null}

                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container sx={{mt: 4, pr: 3, justifyContent: 'flex-end'}} xs={12}>
                                {activeStep > 0 ?
                                <Button sx={{mr: 3}} size="small" variant='outlined' disabled={isDisabledButton} onClick={
                                    () => { setActiveStep(0) }
                                }>
                                    {t("Previous")}
                                </Button>
                                :
                                null
                                }
                                <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                                    () => { setActiveStep(2) }
                                }>
                                {t("Next")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sx={{pt: 2}}>
                                <InputLabel>{t("Sources list")}</InputLabel>
                            </Grid>
                            <Grid item xs={12} sx={{pt: 2}}>
                                {pageData.type == 'Web' ?
                                <Fragment>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {pageData.LinkName && pageData.LinkName.trim().split('\n').map((item: string, index: number)=>{    
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2, mr: 10, pr: 10, py: 0, }} key={index}>
                                                    <Tooltip title={item} placement="left">
                                                        <Typography >{item}</Typography>
                                                    </Tooltip>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                </Fragment>
                                :
                                null
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Fragment>
            :
            null
            }

            {activeStep == 2 ?
            <Fragment>
                <Grid item sx={{pr: 3}} xs={12}>
                    <Grid container alignItems="center">
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>{t('Id')}</TableCell>
                                    <TableCell>{t('Source name')}</TableCell>
                                    <TableCell>{t('Status')}</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {pageData.type == 'Web' && pageData.LinkName && pageData.LinkName.trim().split('\n').map((item: string, index: number)=>{    
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell style={{ width: '5%' }}>{(index+1)}</TableCell>
                                                    <TableCell style={{ width: '80%' }}>{item}</TableCell>
                                                    <TableCell style={{ width: '15%' }}>{pageData.status || 'Waiting'}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                
                <Grid container sx={{mt: 4, pr: 3, justifyContent: 'flex-end'}} xs={12}>
                    {activeStep > 0 ?
                    <Button sx={{mr: 3}} size="small" variant='outlined' disabled={isDisabledButton} onClick={
                        () => { setActiveStep(1) }
                    }>
                        {t("Previous")}
                    </Button>
                    :
                    null
                    }
                    <Button size="small" variant='contained' disabled={isDisabledButton} onClick={
                        () => {  }
                    }>
                    {t("Start upload")}
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
