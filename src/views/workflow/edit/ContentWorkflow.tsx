// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import ApplicationEdit from 'src/views/workflow/edit/ApplicationEdit'

const WorkFlowPermissionList = ['private','team','public']

const ContentWorkflow = (props: any) => {
  // ** Props
  const { workflow, setWorkflow } = props
  
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  useEffect(() => {
    console.log("workflow", workflow)
  }, [workflow])

  // ** State
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const handleInfoSubmit = async () => {
    if(auth.user)   {
        const PostParams = { }
        const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/setopenai', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
        console.log("FormSubmit:", FormSubmit)
        if(FormSubmit?.status == "ok") {
            toast.success(t(FormSubmit.msg) as string, { duration: 4000 })
        }
        else {
            toast.error(t(FormSubmit.msg) as string, { duration: 4000 })
            
            if(FormSubmit && FormSubmit.msg=='Token is invalid') {
                CheckPermission(auth, router, true)
            }
        }
    }

  }

  return (
    <Fragment>
        {auth.user && auth.user.id ?
        <Grid display="flex" flexDirection="column" sx={{py: 2}}>
            <Grid container spacing={2}>
                <Card sx={{ border: theme => `1px solid ${theme.palette.divider}`, my: 1, ml: 3, mr: 3, p: 2 }}>
                    <CardContent>
                        <Grid container spacing={5}>
                            <Grid container item xs={12}>
                                <Grid item xs={5}>
                                    <Typography variant='h6' sx={{ ml: 3, mb: 1 }}>
                                    {`${t(workflow?.name || '')}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} textAlign='right'>
                                    <Typography sx={{ mr: 3, mb: 1, mt: 2, fontSize: '0.62rem' }}>
                                    Id:{`${t(workflow?._id || '')}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='outlined' sx={{mr: 1}} size="small" startIcon={<Icon icon='mingcute:file-export-fill' />} onClick={()=>{
                                }}>
                                {t("Chat")}
                                </Button>
                                <Button variant='outlined' sx={{mr: 1}} size="small" startIcon={<Icon icon='material-symbols:chat' />} onClick={()=>{
                                }}>
                                {t("Publish")}
                                </Button>
                                <Button variant='contained' sx={{mr: 1}} size="small" startIcon={<Icon icon='material-symbols:save' />}onClick={()=>{
                                }}>
                                {t("Delete")}
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Avatar
                                    src={'Item.avatar'}
                                    alt={'Item.name'}
                                    sx={{
                                    width: 38,
                                    height: 38,
                                    mr: 2
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={`${t('Name')}`}
                                    placeholder={`${t('Name')}`}
                                    value={workflow?.name || ''}
                                    onChange={(e: any) => {
                                        setWorkflow((prevState: any)=>({
                                            ...prevState,
                                            name: e.target.value as string
                                        }))
                                        console.log("e.target.value", e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid container item xs={4} alignItems="center">
                                <FormControl sx={{ mr: 0 }}>
                                    <InputLabel >{t("Permission")}</InputLabel>
                                    <Select 
                                        size="small" 
                                        label={t("Permission")}
                                        defaultValue={workflow?.permission || 'private'} 
                                        value={workflow?.permission}
                                        fullWidth
                                        onChange={(e: any) => {
                                            setWorkflow((prevState: any)=>({
                                                ...prevState,
                                                permission: e.target.value as string
                                            }))
                                            console.log("e.target.value", e.target.value);
                                        }}
                                        >
                                        {WorkFlowPermissionList.map((item: any, indexItem: number)=>{
                                            return <MenuItem value={item} key={`${indexItem}`}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid container item xs={12} alignItems="center">
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    size="small"
                                    label={`${t('Intro')}`}
                                    placeholder={`${t('Intro')}`}
                                    value={workflow?.intro || ''}
                                    onChange={(e: any) => {
                                        setWorkflow((prevState: any)=>({
                                            ...prevState,
                                            intro: e.target.value as string
                                        }))
                                        console.log("e.target.value", e.target.value);
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} container justifyContent="flex-end">
                                <Button type='submit' variant='contained' size='small' onClick={handleInfoSubmit} disabled={isDisabledButton} >
                                    {uploadingButton}
                                </Button>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            { workflow ? 
            <ApplicationEdit workflow={workflow} setWorkflow={setWorkflow} />
            :
            null
            }
        </Grid> 
        :
        null
        }   
    </Fragment>
  )
}


export default ContentWorkflow
