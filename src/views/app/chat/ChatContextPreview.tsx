// ** React Imports
import { Fragment, useState } from 'react'
import { useEffect, memo } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ReactMarkdown from 'react-markdown'

const ChatContextPreview = (props: any) => {
    // ** Props
    const {contextPreviewOpen, setContextPreviewOpen, contextPreviewData, GetSystemPromptFromAppValue } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    console.log("contextPreviewData", GetSystemPromptFromAppValue, contextPreviewData)

    return (
        <Dialog fullWidth open={contextPreviewOpen} onClose={
            () => { setContextPreviewOpen( false ) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Box position={'absolute'} right={'5px'} top={'1px'}>
                        <IconButton size="small" edge="end" onClick={
                            () => { setContextPreviewOpen( false ) }
                        } aria-label="close">
                        <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
            <Fragment>
                <Grid item xs={12}>
                    <Card sx={{mt: 2}}>
                        <CardContent sx={{px: 3, py: 0, m: 0}}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', pt: 4, m: 0 }}>
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    System
                                </Typography>
                                <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                    <ReactMarkdown>{GetSystemPromptFromAppValue.replace('\n', '  \n')}</ReactMarkdown>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                {contextPreviewData && contextPreviewData.map((item: any)=>{

                    return (
                        <Fragment>
                            <Grid item xs={12}>
                                <Card sx={{mt: 2}}>
                                    <CardContent sx={{px: 3, py: 0, m: 0}}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', pt: 4, m: 0 }}>
                                            <Typography sx={{ fontSize: '0.875rem' }}>
                                                Human
                                            </Typography>
                                            <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                                <ReactMarkdown>{item[0].replace('\n', '  \n')}</ReactMarkdown>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card sx={{mt: 2}}>
                                    <CardContent sx={{px: 3, py: 0, m: 0}}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', pt: 4, m: 0 }}>
                                            <Typography sx={{ fontSize: '0.875rem' }}>
                                                AI
                                            </Typography>
                                            <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                                <ReactMarkdown>{item[1].replace('\n', '  \n')}</ReactMarkdown>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Fragment>
                    )
                })}
            </Fragment>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    )
}

export default ChatContextPreview
