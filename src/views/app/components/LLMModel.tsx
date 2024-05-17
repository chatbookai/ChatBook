import { useEffect, memo, useState } from 'react'

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
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Slider from '@mui/material/Slider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { GetLLMS } from 'src/functions/ChatBook'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

const LLMModel = (props: any) => {
    // ** Props
    const {LLMModel, setLLMModel, ModelData, handleAiModelChange, index } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    const [llms, setLlms] = useState<any>()
    useEffect(() => {
        const fetchData = async () => {
            setLlms(await GetLLMS())
        };
        fetchData();
    }, [])

    return (
        <Dialog fullWidth open={LLMModel.LLMModelOpen} onClose={
            () => { setLLMModel( (prevState: any) => ({ ...prevState, LLMModelOpen: false }) ) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                <Typography sx={{pl: 2}}>{t(ModelData.label) as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setLLMModel( (prevState: any) => ({ ...prevState, LLMModelOpen: false }) ) }
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
                            <InputLabel id='demo-dialog-select-label'>{t("AiModel")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6, pl: 2}}>
                            <Select 
                                size="small"
                                defaultValue={LLMModel.model} 
                                value={LLMModel.model}
                                fullWidth
                                onChange={(e: any) => {
                                    if(e.target.value != null) {
                                        const currentLLM = llms.llmModels.filter((item: any)=>item.model == e.target.value)
                                        setLLMModel( (prevState: any) => ({ ...prevState, model: String(e.target.value), name: String(currentLLM[0]['name']) }) )
                                    }
                                }}
                                >
                            {llms && llms.llmModels && llms.llmModels[0] && llms.llmModels.map((item: any, index: number)=>{
                                return <MenuItem value={item.model} key={`llmModels_${index}`}>{item.name}</MenuItem>
                            })}
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("charsPointsPrice")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6}}>
                            <Typography sx={{pl: 2}}>{LLMModel.charsPointsPrice} {t('credit')}/1K tokens</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("maxContext")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6}}>
                            <Typography sx={{pl: 2}}>{LLMModel.maxContext}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("functionCall")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{pt: 6}}>
                            <Typography sx={{pl: 2}}>{LLMModel.functionCall ? t('Enabled') : t('Disabled')}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("temperature")}</InputLabel>
                        </Grid>
                        <Grid item xs={7.5} sx={{pt: 6, pl: 2, textAlign: 'center'}}>
                            <Slider
                                size="small"
                                min={0}
                                max={1}
                                step={0.1}
                                onChange={(e: any) => {
                                    if(e.target.value != null) {
                                        setLLMModel( (prevState: any) => ({ ...prevState, temperature: Number(e.target.value as string) }) )
                                    }
                                }}
                                value={LLMModel.temperature}
                                valueLabelDisplay='on'
                                aria-labelledby="custom-marks-slider"
                                marks={[
                                    {value: 0, label: t('rigorous') as string},
                                    {value: 0.5, label: t('moderate') as string},
                                    {value: 1, label: t('divergent') as string}
                                    ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("maxResponse")}</InputLabel>
                        </Grid>
                        <Grid item xs={7.5} sx={{pt: 6, pl: 2, textAlign: 'center'}}>
                            <Slider
                                size="small"
                                min={0}
                                max={LLMModel.maxContext}
                                step={100}
                                onChange={(e: any) => {
                                    if(e.target.value != null) {
                                        setLLMModel( (prevState: any) => ({ ...prevState, maxResponse: Number(e.target.value as string) }) )
                                    }
                                }}
                                value={LLMModel.maxResponse}
                                valueLabelDisplay='on'
                                aria-labelledby="custom-marks-slider"
                                marks={[
                                    { value: 0, label: 0 },
                                    { value: LLMModel.maxContext, label: LLMModel.maxContext }
                                    ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("maxChatHistories")}</InputLabel>
                        </Grid>
                        <Grid item xs={7.5} sx={{pt: 6, pl: 2, textAlign: 'center'}}>
                            <Slider
                                size="small"
                                min={0}
                                max={30}
                                step={1}
                                onChange={(e: any) => {
                                    if(e.target.value != null) {
                                        setLLMModel( (prevState: any) => ({ ...prevState, maxChatHistories: Number(e.target.value as string) }) )
                                    }
                                }}
                                value={LLMModel.maxChatHistories}
                                valueLabelDisplay='on'
                                aria-labelledby="custom-marks-slider"
                                marks={[
                                    { value: 0, label: 0 },
                                    { value: 30, label: 30 }
                                    ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>


            </DialogContent>
            <DialogActions>
                <Button size="small" variant='outlined' onClick={
                    () => { setLLMModel( (prevState: any) => ({ ...prevState, LLMModelOpen: false }) ) }
                }>
                {t("Close")}
                </Button>
                <Button size="small" variant='contained' onClick={
                    () => { 
                        setLLMModel( (prevState: any) => ({ ...prevState, LLMModelOpen: false }) ) 
                        handleAiModelChange(index, LLMModel)
                    }
                }>
                {t("Confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(LLMModel);
