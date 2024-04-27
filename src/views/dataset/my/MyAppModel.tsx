// ** React Imports
import { Fragment, useState } from 'react'
import ReactMarkdown from 'react-markdown'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import authConfig from 'src/configs/auth'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'

const AppModel = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const theme = useTheme()

  // ** Props
  const {
    app,
    loading,
    loadingText,
    agent,
    setAgent,
    show,
    setShow,
    handelAddUserAgentAndChat,
    handelAddUserAgent,
    handelCancelUserAgent,
    handleTypeFilter,
    handleSearchFilter,
    userAgents,
    setNewOpen
  } = props

  const [typeName, setTypeName] = useState<string>("")

  const handleImgInfo = (item: any) => {
    setShow(true)
    setAgent(item)
  }

  const handleClickTypeFilter = (Item: string) => {
    setTypeName(Item)
    handleTypeFilter(Item)
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
    }
    setTypeName("ALL")
    handleSearchFilter(event.target.value)
  };

  console.log("userAgents", userAgents)
  console.log("agent", agent)
  
  const renderContent = () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <Card sx={{ px: 3, pt: 1}}>
              {true ? (
                <Fragment>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box p={2}>
                        <Typography variant="h6">{t('My Dataset')}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box p={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" size="small" startIcon={<Icon icon='mdi:add' />} onClick={()=>{setNewOpen(true)}}>
                        {t('New Dataset')}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: 2, mb: 2}}>
                    {app && app.map((item: any, index: number) => (
                      <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
                        <Box position="relative" sx={{mb: 1, mr: 1}}>
                          <CardMedia image={`${authConfig.backEndApiChatBook}/images/pages/tree-cone-cube-bg-${theme.palette.mode}.png`} sx={{ height: '13.25rem', objectFit: 'contain', borderRadius: 1 }}/>
                          <Box position="absolute" top={10} left={5} m={1} px={0.8} borderRadius={1} onClick={()=>handleImgInfo(item)} sx={{ cursor: 'pointer' }}>
                            <Avatar src={item.avatar} sx={{ mr: 3, width: 50, height: 50 }} />
                          </Box>
                          {userAgents && item && item.id && userAgents.includes(item.id) ?
                          <Box position="absolute" top={0} right={0} m={1} px={0.8} borderRadius={1} sx={{ cursor: 'pointer' }}>
                            <IconButton aria-label='capture screenshot' onClick={()=>{handelCancelUserAgent()}}>
                              <Icon icon='mdi:delete-outline' />
                            </IconButton>
                          </Box>
                          :
                          null}
                          <Box position="absolute" top={70} left={5} m={1} px={0.8} borderRadius={1} onClick={()=>handleImgInfo(item)} sx={{ cursor: 'pointer' }}>
                            <Typography sx={{ 
                                  fontWeight: 500,
                                  lineHeight: 1.71,
                                  letterSpacing: '0.22px',
                                  fontSize: '1rem !important',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  }} >{item.title}</Typography>
                          </Box>
                          <Box position="absolute" top={100} left={5} m={1} px={0.8} borderRadius={1} onClick={()=>handleImgInfo(item)} 
                            sx={{ 
                              cursor: 'pointer',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                            }}>
                            <Typography variant='caption'>{item.description}</Typography>
                          </Box>
                          <Box position="absolute" bottom={0} left={1} m={1} px={0.8} bgcolor="rgba(0, 0, 0, 0.35)" borderRadius={0.7} color="white" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            <Typography variant="body2" color="white">{item.tags}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                    {app && app.length == 0 ?
                    <Grid 
                      item 
                      key='0' 
                      xs={12}
                      sx={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      <Typography variant="body1">{t('No Data')}</Typography>
                    </Grid>
                    :
                    null}
                  </Grid>
                </Fragment>
              ) : (
                <Fragment></Fragment>
              )}
            </Card>
            {show && agent ?
            <Drawer
              open={show}
              anchor='right'
              onClose={() => setShow(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
            >              
              <Container>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid sx={{ height: '100%', px: 4 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <Box
                          position="relative"
                          sx={{
                            mt: 6, // 设置顶部边距
                            display: 'flex',
                            justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                          }}
                        >
                          <Avatar src={agent.avatar} sx={{ width: 100, height: 100 }} />
                        </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                            {agent.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{mb: 2}}>
                            {agent.description}
                          </Typography>
                          {userAgents && agent && agent.id && userAgents.includes(agent.id) ?
                          <Button variant={'contained'} size="small" sx={{mb: 2}} fullWidth onClick={()=>{handelCancelUserAgent()}}>{t('Cancel Agent')}</Button>
                          :
                          <Fragment>
                            <Button variant={'contained'} size="small" sx={{mb: 2}} fullWidth onClick={()=>{handelAddUserAgentAndChat()}}>{t('Add Agent And Chat')}</Button>
                            <Button variant={'outlined'} size="small" sx={{mb: 2}} fullWidth onClick={()=>{handelAddUserAgent()}}>{t('Add Agent')}</Button>
                          </Fragment>
                          }
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                          sx={{
                            boxShadow: 1,
                            borderRadius: 1,
                            width: 'fit-content',
                            fontSize: '0.875rem',
                            p: theme => theme.spacing(2, 4),
                          }}
                          >
                            <ReactMarkdown>{agent.config.replace('\n', '  \n')}</ReactMarkdown>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
            </Drawer>
            :
            null}
            {loading ?
            <Dialog
              open={show}
              onClose={() => setShow(false)}
            >
              <DialogContent sx={{ position: 'relative' }}>
                <Container>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sx={{}}>
                      <Box sx={{ ml: 6, display: 'flex', alignItems: 'center', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                        <CircularProgress sx={{ mb: 4 }} />
                        <Typography>{t(loadingText) as string}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </DialogContent>
            </Dialog>
            :
            null}
          </Grid>
        </Grid>
      )
  }

  return renderContent()
}

export default AppModel
