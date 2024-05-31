// ** React Imports
import { useRef, Fragment, useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card'
import ReactMarkdown from 'react-markdown'
import { styled } from '@mui/material/styles'
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: any }>(({ theme }) => ({
    padding: theme.spacing(3, 5, 3, 3)
  }))


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

    const chatArea = useRef(null)

    return (
        <Dialog fullWidth open={contextPreviewOpen} onClose={
            () => { setContextPreviewOpen( false ) }
        }>
            <DialogTitle sx={{mx:1, p:2, pb:1}}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>{t('Chat Log Preview') as string}</Typography>
                <Box>
                    <IconButton size="small" edge="end" onClick={() => { setContextPreviewOpen( false ) }} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            </DialogTitle>
            <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false, suppressScrollX: true }}>
                <Fragment>
                    <Grid item xs={12}>
                        <Card>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', pt: 4, px: 4, m: 0 }}>
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    {t('System')}
                                </Typography>
                                <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                    <ReactMarkdown>{GetSystemPromptFromAppValue.replace('\n', '  \n')}</ReactMarkdown>
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                    {contextPreviewData && contextPreviewData.map((item: any, index: number)=>{

                        return (
                            <Fragment key={index}>
                                <Grid item xs={12}>
                                    <Card sx={{mt: 2}}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', pt: 4, px: 4, m: 0 }}>
                                            <Typography sx={{ fontSize: '0.875rem' }}>
                                            {t('Human')}
                                            </Typography>
                                            <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                                <ReactMarkdown>{item[0].replace('\n', '  \n')}</ReactMarkdown>
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card sx={{mt: 2}}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', pt: 4, px: 4, m: 0 }}>
                                            <Typography sx={{ fontSize: '0.875rem' }}>
                                                {t('AI')}
                                            </Typography>
                                            <Typography sx={{ color: 'action.active', fontSize: '0.8125rem' }}>
                                                <ReactMarkdown>{item[1].replace('\n', '  \n')}</ReactMarkdown>
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Fragment>
                        )
                    })}
                </Fragment>
            </PerfectScrollbar>
        </Dialog>
    )
}

export default ChatContextPreview
