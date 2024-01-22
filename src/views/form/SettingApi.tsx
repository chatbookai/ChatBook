// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const SettingForm = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props
  
  // ** Hook
  const { t } = useTranslation()
    
  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [openApiKey, setOpenApiKey] = useState<string>("")
  const [openApiKeyError, setOpenApiKeyError] = useState<string | null>(null)
  const handleOpenApiKeyChange = (event: any) => {
    setOpenApiKey(event.target.value);
    if(event.target.value == "") {
        setOpenApiKeyError(`${t('This field cannot be empty')}`)
    }
    else {
        setOpenApiKeyError("")
    }
  };
  
  const [inputTemperature, setInputTemperature] = useState<number>(0.5)
  const [inputTemperatureError, setInputTemperatureError] = useState<string | null>(null)
  const handleInputTemperatureChange = (event: any) => {
    setInputTemperature(Number(event.target.value));
    if(Number(event.target.value) < 0) {
        setInputTemperatureError(`${t('The number entered must be more greater or equal to 0')}`)
    }
    else if(Number(event.target.value) >= 1) {
        setInputTemperatureError(`${t('The number entered must be less than or equal to 1')}`)
    }
    else {
        setInputTemperatureError("")
    }
  };

  const [inputModelName, setInputModelName] = useState<string>("gpt-3.5-turbo")
  const [inputModelNameError, setInputModelNameError] = useState<string | null>(null)
  const handleInputModelNameChange = (event: any) => {
    setInputModelName(event.target.value);
    if(event.target.value == "") {
        setInputModelNameError(`${t('This field cannot be empty')}`)
    }
    else {
        setInputModelNameError("")
    }
  };

  const handleGetData = async () => {
    const GetData: any = await axios.get(authConfig.backEndApi + '/getopenai', {}).then(res => res.data)
    console.log("GetData:", GetData)
    setOpenApiKey(GetData.OPENAI_API_KEY)
    setInputTemperature(GetData.Temperature)
    setInputModelName(GetData.ModelName)
  }

  useEffect(()=>{
    handleGetData()
  }, [])

  const handleSubmit = async () => {
    if(openApiKey == "") {
        toast.error("Open AI Api cannot be empty", { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }
    if(inputModelName == "") {
        toast.error("Model Name Api cannot be empty", { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }
    if(inputTemperature < 0 || inputTemperature > 1) {
        toast.error("Temperature must in the range 0~1", { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }

    const PostParams = {OPENAI_API_KEY: openApiKey, ModelName: inputModelName, Temperature: inputTemperature, userId: userId, knowledgeId: knowledgeId }
    const FormSubmit: any = await axios.post(authConfig.backEndApi + '/setopenai', PostParams).then(res => res.data)
    console.log("FormSubmit:", FormSubmit)
    if(FormSubmit?.status == "ok") {
        toast.success(FormSubmit.msg, { duration: 4000 })
    }
    else {
        toast.error(FormSubmit.msg, { duration: 4000 })
    }

  }

  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Open API & Pinecone')}`} />
        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={`${t('OPENAI_API_KEY')}`}
                        placeholder={`${t('OPENAI_API_KEY')}`}
                        value={openApiKey}
                        onChange={handleOpenApiKeyChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!openApiKeyError}
                        helperText={openApiKeyError}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        type='number'
                        label={`${t('Temperature')}`}
                        placeholder={`${t('Temperature')}`}
                        value={inputTemperature}
                        onChange={handleInputTemperatureChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputTemperatureError}
                        helperText={inputTemperatureError}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={`${t('ModelName')}`}
                        placeholder={`${t('ModelName')}`}
                        value={inputModelName}
                        onChange={handleInputModelNameChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputModelNameError}
                        helperText={inputModelNameError}
                    />
                </Grid>

                
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={`${t('PINECONE_API_KEY')}`}
                        placeholder={`${t('PINECONE_API_KEY')}`}
                        value={pinecoinApiKey}
                        onChange={handlePinecoinApiKeyChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!pinecoinApiKeyError}
                        helperText={pinecoinApiKeyError}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={`${t('PINECONE_ENVIRONMENT')}`}
                        placeholder={`${t('PINECONE_ENVIRONMENT')}`}
                        value={inputPINECONE_ENVIRONMENT}
                        onChange={handleInputPINECONE_ENVIRONMENTChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputPINECONE_ENVIRONMENTError}
                        helperText={inputPINECONE_ENVIRONMENTError}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={`${t('PINECONE_INDEX_NAME')}`}
                        placeholder={`${t('PINECONE_INDEX_NAME')}`}
                        value={inputPINECONE_INDEX_NAME}
                        onChange={handleInputPINECONE_INDEX_NAMEChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputPINECONE_INDEX_NAMEError}
                        helperText={inputPINECONE_INDEX_NAMEError}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label={`${t('PINECONE_NAME_SPACE')}`}
                        placeholder={`${t('PINECONE_NAME_SPACE')}`}
                        value={inputPINECONE_NAME_SPACE}
                        onChange={handleInputPINECONE_NAME_SPACEChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputPINECONE_NAME_SPACEError}
                        helperText={inputPINECONE_NAME_SPACEError}
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>
            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}


export default SettingForm
