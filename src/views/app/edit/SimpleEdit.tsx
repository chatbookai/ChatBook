// ** React Imports
import { Fragment, useEffect, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField2 from 'src/context/TextField2'
import { styled } from '@mui/material/styles'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import PerfectScrollbar from 'react-perfect-scrollbar'
import SimpleEditApplication from 'src/views/app/edit/SimpleEditApplication'
import SimpleEditAppDelete from 'src/views/app/edit/SimpleEditAppDelete'

const WorkFlowPermissionList = ['private','team','public']

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
    }
}

const SimpleEdit = (props: any) => {
  // ** Props
  const { app, setApp, handleEditApp, handleDeleteApp, isDisabledButton, deleteOpen, setDeleteOpen, avatarFiles, setAvatarFiles } = props
  
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

  // Styled component for the upload image inside the dropzone area
  const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(15.75)
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
        width: 38
    }
  }))

  const { getRootProps: getRootPropsAvatar, getInputProps: getInputPropsAvatar } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles: File[]) => {
        setAvatarFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const hidden = false;
  
  return (
    <Fragment>
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 0.25rem)' }}>
            <ScrollWrapper hidden={hidden}>
                {auth.user && auth.user.id ?
                <Grid display="flex" flexDirection="column" sx={{py: 2}}>
                    <Grid container spacing={2}>
                        <Card sx={{ border: theme => `1px solid ${theme.palette.divider}`, my: 1, ml: 3, mr: 3, p: 2 }}>
                            <CardContent>
                                <Grid container spacing={5}>
                                    <Typography sx={{ p: 0, m: 0, mt: 0, fontSize: '0.8rem', textAlign: 'right' }}>
                                        Id: {`${t(app?._id || '')}`}
                                    </Typography>
                                    <Grid item xs={12} sx={{m: 0, p: 0}}>
                                        <Typography variant='h6' sx={{ ml: 0, mb: 0 }}>
                                            {`${t(app?.name || '')}`}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button variant='outlined' sx={{mr: 1}} size="small" startIcon={<Icon icon='mingcute:file-export-fill' />} onClick={()=>{
                                            router.push('/app/chat/' + app?._id)
                                        }}>
                                        {t("Chat")}
                                        </Button>
                                        <Button variant='outlined' sx={{mr: 1}} size="small" startIcon={<Icon icon='material-symbols:chat' />} onClick={()=>{
                                            router.push('/app/publish/' + app?._id)
                                        }}>
                                        {t("Publish")}
                                        </Button>
                                        <Button variant='contained' sx={{mr: 1}} size="small" startIcon={<Icon icon='material-symbols:save' />}onClick={()=>{
                                            setDeleteOpen(true)
                                        }}>
                                        {t("Delete")}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box {...getRootPropsAvatar({ className: 'dropzone' })} sx={{width: '38px', height: '38px', cursor: 'pointer'}}>
                                            <input {...getInputPropsAvatar()} />
                                            {avatarFiles && avatarFiles.length ? (
                                                <Box  sx={{ alignItems: 'center'}}>
                                                    <Img alt={`${t(`Upload Avatar image`)}`} src={URL.createObjectURL(avatarFiles[0] as any)} sx={{width: '100%', borderRadius: '25px'}}/>
                                                </Box>
                                            ) : (
                                                <Box sx={{alignItems: 'center'}}>
                                                    <Img alt={`${t(`Upload Avatar image`)}`} src={authConfig.backEndApiChatBook + '/api/avatarforapp/' + app.avatar} sx={{width: '100%', borderRadius: '25px'}}/>
                                                </Box>
                                            )}
                                        </Box>
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
                                        <TextField2
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
                    { app ? 
                    <SimpleEditAppDelete deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} isDisabledButton={isDisabledButton} handleDeleteApp={handleDeleteApp}/>
                    :
                    null
                    }
                </Grid> 
                :
                null
                }
            </ScrollWrapper>
        </Box>
    </Fragment>
  )
}


export default SimpleEdit
