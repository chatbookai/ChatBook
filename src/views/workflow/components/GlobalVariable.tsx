import { useEffect, memo, ChangeEvent } from 'react'

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
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import InputLabel from '@mui/material/InputLabel'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

import CustomRadioIconsType from 'src/@core/components/custom-radio/iconstype'

const GlobalVariableTypeList: any[] = [
  {
    value: 'text',
    icon: 'mdi:rocket-launch-outline'
  },
  {
    value: 'paragraph',
    icon: 'mdi:account-outline'
  },
  {
    value: 'select',
    icon: 'mdi:account-outline'
  },
  {
    value: 'api',
    icon: 'mdi:account-outline'
  }
]
  

const GlobalVariable = (props: any) => {
    // ** Props
    const {GlobalVariable, setGlobalVariable, ModelData } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])


    return (
        <Dialog fullWidth open={GlobalVariable.GlobalVariableOpen} onClose={
            () => { setGlobalVariable( (prevState: any) => ({ ...prevState, GlobalVariableOpen: false }) ) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                <Typography sx={{pl: 2}}>{t(ModelData.label) as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setGlobalVariable( (prevState: any) => ({ ...prevState, GlobalVariableOpen: false }) ) }
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
                            <InputLabel id='demo-dialog-select-label'>{t("Required")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{py: 1.5}}>
                            <Switch 
                                checked={GlobalVariable.required} 
                                onChange={(e: any) => {
                                    setGlobalVariable((prevState: any) => ({ ...prevState, required: !!e.target.checked }))
                                }} 
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("VariableName")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{py: 1.5}}>
                            <TextField
                              fullWidth
                              value={t(GlobalVariable.VariableName) as string}
                              size="small"
                              onChange={(e: any) => {
                                if(e.target.value != null) {
                                    setGlobalVariable((prevState: any) => ({ ...prevState, VariableName: e.target.value }))
                                }
                              }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel id='demo-dialog-select-label'>{t("VariableKey")}</InputLabel>
                        </Grid>
                        <Grid item xs={8} sx={{py: 1.5}}>
                            <TextField
                              fullWidth
                              value={t(GlobalVariable.VariableKey) as string}
                              size="small"
                              onChange={(e: any) => {
                                if(e.target.value != null) {
                                    setGlobalVariable((prevState: any) => ({ ...prevState, VariableKey: e.target.value }))
                                }
                              }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel id='demo-dialog-select-label'>{t("VariableType")}</InputLabel>
                    <Grid container spacing={2} sx={{mt: 1}}> {/* Add container for spacing and alignment */}
                        {GlobalVariableTypeList.map((item, index) => (
                        <Grid item key={index} xs={6}> {/* Each item takes up 6 columns, which is half of 12 */}
                            <CustomRadioIconsType
                            data={item}
                            selected={GlobalVariable.VariableType}
                            name='custom-radios-basic'
                            handleChange={(prop: string | ChangeEvent<HTMLInputElement>) => {
                                if(typeof prop === 'string') {
                                    setGlobalVariable((prevState: any) => ({ ...prevState, VariableType: prop }))
                                }
                            }}
                            />
                        </Grid>
                        ))}
                    </Grid>
                </Grid>

                {GlobalVariable.VariableType == 'text' ? 
                    <Grid item xs={12} sx={{py: 0}}>
                        <InputLabel id='demo-dialog-select-label' sx={{py: 2}}>{t("TextMaxLength")}</InputLabel>
                        <TextField
                        fullWidth
                        type="number"
                        value={t(GlobalVariable.TextMaxLength) as string}
                        inputProps={{ min: 0, max: 500 }} 
                        size="small"
                        onChange={(e: any) => {
                            if(e.target.value != null) {
                                setGlobalVariable((prevState: any) => ({ ...prevState, TextMaxLength: e.target.value }))
                            }
                        }}
                        />
                    </Grid>
                :
                null
                }
                
                {GlobalVariable.VariableType == 'select' ? 
                    <Grid item xs={12} sx={{py: 0}}>
                        <InputLabel id='demo-dialog-select-label' sx={{py: 2}}>{t("SelectOptions")}</InputLabel>
                        <TextField
                        fullWidth
                        value={t(GlobalVariable.SelectOptions) as string}
                        size="small"
                        onChange={(e: any) => {
                            if(e.target.value != null) {
                                setGlobalVariable((prevState: any) => ({ ...prevState, SelectOptions: e.target.value }))
                            }
                        }}
                        />
                    </Grid>
                :
                null
                }

                {GlobalVariable.VariableType == 'paragraph' ? 
                    <Grid item xs={12} sx={{py: 2, height: '79px'}}>
                        <Typography sx={{pl: 2}}>{t("VariableTypeParagraphTip")}</Typography>
                    </Grid>
                :
                null
                }

                {GlobalVariable.VariableType == 'api' ? 
                    <Grid item xs={12} sx={{py: 2, height: '79px'}}>
                        <Typography sx={{pl: 2}}>{t("VariableTypeApiTip")}</Typography>
                    </Grid>
                :
                null
                }


            </DialogContent>
            <DialogActions>
                <Button size="small" variant='outlined' onClick={
                    () => { setGlobalVariable( (prevState: any) => ({ ...prevState, GlobalVariableOpen: false }) ) }
                }>
                {t("Close")}
                </Button>
                <Button size="small" variant='contained' onClick={
                    () => { setGlobalVariable( (prevState: any) => ({ ...prevState, GlobalVariableOpen: false }) ) }
                }>
                {t("Add")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(GlobalVariable);
