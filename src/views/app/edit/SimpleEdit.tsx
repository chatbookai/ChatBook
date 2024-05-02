// ** React Imports
import { Fragment, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

// ** Axios Imports
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import SimpleEditApplication from 'src/views/app/edit/SimpleEditApplication'

const WorkFlowPermissionList = ['private','team','public']

const SimpleEdit = (props: any) => {
  // ** Props
  const { app, setApp, handleEditApp, isDisabledButton } = props
  
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  useEffect(() => {
    console.log("app", app)
  }, [app])

  // ** State
  
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
                                    {`${t(app?.name || '')}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} textAlign='right'>
                                    <Typography sx={{ mr: 3, mb: 1, mt: 2, fontSize: '0.8rem' }}>
                                    Id:{`${t(app?._id || '')}`}
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
                                    value={app?.name || ''}
                                    onChange={(e: any) => {
                                        setApp((prevState: any)=>({
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
                                        value={app?.permission || 'private'} 
                                        fullWidth
                                        onChange={(e: any) => {
                                            setApp((prevState: any)=>({
                                                ...prevState,
                                                permission: e.target.value as string
                                            }))
                                            console.log("e.target.value", e.target.value);
                                        }}
                                        >
                                        {WorkFlowPermissionList.map((item: any, indexItem: number)=>{
                                            return <MenuItem value={item} key={`${indexItem}`}>{t(item) as string}</MenuItem>
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
                                    value={app?.intro || ''}
                                    onChange={(e: any) => {
                                        setApp((prevState: any)=>({
                                            ...prevState,
                                            intro: e.target.value as string
                                        }))
                                        console.log("e.target.value", e.target.value);
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} container justifyContent="flex-end">
                                <Button type='submit' variant='contained' size='small' onClick={()=>{handleEditApp()}} disabled={isDisabledButton} >
                                    {t('Submit')}
                                </Button>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            { app ? 
            <SimpleEditApplication app={app} setApp={setApp} handleEditApp={handleEditApp} isDisabledButton={isDisabledButton} />
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


export default SimpleEdit
