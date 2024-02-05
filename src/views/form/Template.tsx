// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { CheckPermission } from 'src/functions/ChatBook'


const TemplateModelForm = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router)
  }, [])

  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const [CONDENSE_TEMPLATE, setCONDENSE_TEMPLATE] = useState<string>("")
  const [CONDENSE_TEMPLATEError, setCONDENSE_TEMPLATEError] = useState<string | null>(null)
  const handleCONDENSE_TEMPLATEChange = (event: any) => {
    setCONDENSE_TEMPLATE(event.target.value);
    if(event.target.value == "") {
        setCONDENSE_TEMPLATEError(`${t('This field cannot be empty')}`)
    }
    else {
        setCONDENSE_TEMPLATEError("")
    }
  };
  
  const [QA_TEMPLATE, setQA_TEMPLATE] = useState<string>("")
  const [QA_TEMPLATEError, setQA_TEMPLATEError] = useState<string | null>(null)
  const handleQA_TEMPLATEChange = (event: any) => {
    setQA_TEMPLATE(event.target.value);
    if(event.target.value == "") {
        setQA_TEMPLATEError(`${t('This field cannot be empty')}`)
    }
    else {
        setQA_TEMPLATEError("")
    }
    console.log("userId", userId)
  };

  const handleGetData = async () => {
    if (auth && auth.user) {
        const GetData: any = await axios.get(authConfig.backEndApiChatBook + '/api/gettemplate/' + knowledgeId, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
        console.log("GetData:", GetData)
        setCONDENSE_TEMPLATE(GetData.CONDENSE_TEMPLATE || '')
        setQA_TEMPLATE(GetData.QA_TEMPLATE || '')
    }
  }

  useEffect(()=>{
    handleGetData()
  }, [knowledgeId])

  const handleSubmit = async () => {
    if(CONDENSE_TEMPLATE == "" && QA_TEMPLATE == "") {
        toast.error(t("TEMPLATE cannot be empty") as string, { duration: 4000 })
        setIsDisabledButton(false)
        setUploadingButton(`${t('Submit')}`)

        return
    }
    if (auth && auth.user) {
        const PostParams = {CONDENSE_TEMPLATE: CONDENSE_TEMPLATE, QA_TEMPLATE: QA_TEMPLATE, knowledgeId: knowledgeId}
        const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/settemplate', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
        console.log("FormSubmit:", FormSubmit)
        if(FormSubmit?.status == "ok") {
            toast.success(t(FormSubmit.msg) as string, { duration: 4000 })
        }
        else {
            toast.error(t(FormSubmit.msg) as string, { duration: 4000 })
        }
    }

  }

  return (
    <Fragment>
        <Card>
        <CardHeader title={`${knowledgeName} ${t('Template Setting')}`} />
        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={12}
                        label={`${t('CONDENSE_TEMPLATE')}`}
                        placeholder={`${t('CONDENSE_TEMPLATE')}`}
                        sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                        value={CONDENSE_TEMPLATE}
                        onChange={handleCONDENSE_TEMPLATEChange}
                        error={!!CONDENSE_TEMPLATEError}
                        helperText={CONDENSE_TEMPLATEError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={12}
                        label={`${t('QA_TEMPLATE')}`}
                        placeholder={`${t('QA_TEMPLATE')}`}
                        sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                        value={QA_TEMPLATE}
                        onChange={handleQA_TEMPLATEChange}
                        error={!!QA_TEMPLATEError}
                        helperText={QA_TEMPLATEError}
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


export default TemplateModelForm
