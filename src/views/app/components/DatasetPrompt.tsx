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
import Typography from '@mui/material/Typography'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';
import TextField2 from 'src/context/TextField2'

const DatasetPrompt = (props: any) => {
    // ** Props
    const {DatasetPrompt, setDatasetPrompt, handleDatasetPromptChange, index } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    useEffect(() => {
        const fetchData = async () => {
            if(auth && auth.user && auth.user.token)  {
                
            }
        };
        fetchData();
    }, [])

    return (
        <Dialog fullWidth open={DatasetPrompt.DatasetPromptOpen} onClose={
            () => { setDatasetPrompt( (prevState: any) => ({ ...prevState, DatasetPromptOpen: false }) ) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                <Typography sx={{pl: 2}}>{t('Select dataset template') as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setDatasetPrompt( (prevState: any) => ({ ...prevState, DatasetPromptOpen: false }) ) }
                    } aria-label="close">
                    <CloseIcon />
                    </IconButton>
                </Box>
                </Box>
            </DialogTitle>
            <DialogContent sx={{  }}>
                <Grid item xs={12}>
                    <Grid container item xs={12} alignItems="center" sx={{mt: 3}}>
                        <TextField2
                            fullWidth
                            multiline
                            rows={10}
                            size="small"
                            label={`${t('REPHRASE_TEMPLATE')}`}
                            placeholder={`${t('REPHRASE_TEMPLATE')}`}
                            value={DatasetPrompt.REPHRASE_TEMPLATE}
                            onChange={(e: any) => {
                                setDatasetPrompt((prevState: any)=>({
                                    ...prevState,
                                    REPHRASE_TEMPLATE: e.target.value as string
                                }))
                            }}
                        />
                    </Grid>
                    <Grid container item xs={12} alignItems="center" sx={{mt: 3}}>
                        <TextField2
                            fullWidth
                            multiline
                            rows={10}
                            size="small"
                            label={`${t('QA_TEMPLATE')}`}
                            placeholder={`${t('QA_TEMPLATE')}`}
                            value={DatasetPrompt.QA_TEMPLATE}
                            onChange={(e: any) => {
                                setDatasetPrompt((prevState: any)=>({
                                    ...prevState,
                                    QA_TEMPLATE: e.target.value as string
                                }))
                            }}
                        />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button size="small" variant='contained' onClick={
                    () => { 
                        setDatasetPrompt( (prevState: any) => ({ ...prevState, DatasetPromptOpen: false }) ) 
                        handleDatasetPromptChange(index, DatasetPrompt)
                    }
                }>
                {t("Confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(DatasetPrompt);
