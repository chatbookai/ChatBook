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
import InputAdornment from '@mui/material/InputAdornment'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import Avatar from '@mui/material/Avatar'
import { useAuth } from 'src/hooks/useAuth'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'

const AgentList = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()

  // ** Props
  const {
    agentList,
    loading,
    loadingText,
    agent,
    setAgent,
    show,
    setShow,
    handelUserAgentAction,
    addOrDeleteUserAgentText1,
    addOrDeleteUserAgentText2,
    TypeList,
    handleTypeFilter
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

  const TypeListArray = TypeList.split(',')
  
  const renderContent = () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <Card sx={{ px: 3, pt: 1}}>
              {true ? (
                <Fragment>
                  <Grid container spacing={2} sx={{ pt: 5, pl: 2}}>
                    <TextField id='color-outlined' label={t('Search Agent') as string} size="small" fullWidth 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon icon='mdi:search' />
                        </InputAdornment>
                      )
                    }}
                    />
                  </Grid>
                  <Grid container spacing={2} sx={{ pt: 3, pl: 2}}>
                    {TypeListArray.map((Item: string, index: number) => {

                      return (<Button key={index} variant={typeName==Item?'contained':'outlined'} size="small" sx={{mr: 2, mt: 2}} onClick={()=>{handleClickTypeFilter(Item)}}>{Item}</Button>)                      
                    })}
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: 2, mb: 2}}>
                    {agentList && agentList.map((item: any, index: number) => (
                      <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
                        <Box position="relative" sx={{mb: 1, mr: 1}}>
                          <CardMedia image={`${authConfig.backEndApiChatBook}/images/pages/tree-cone-cube-bg-light.png`} sx={{ height: '13.25rem', objectFit: 'contain', borderRadius: 1 }}/>
                          <Box position="absolute" top={10} left={5} m={1} px={0.8} borderRadius={1} onClick={()=>handleImgInfo(item)} sx={{ cursor: 'pointer' }}>
                            <Avatar src={"/images/avatars/1.png"} sx={{ mr: 3, width: 50, height: 50 }} />
                          </Box>
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
                          <Avatar src={"/images/avatars/1.png"} sx={{ width: 100, height: 100 }} />
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
                          <Button variant={'contained'} size="small" sx={{mb: 2}} fullWidth onClick={()=>{handelUserAgentAction(1)}}>{addOrDeleteUserAgentText1}</Button>
                          {addOrDeleteUserAgentText2 ? 
                          <Button variant={'outlined'} size="small" sx={{mb: 2}} fullWidth onClick={()=>{handelUserAgentAction(2)}}>{addOrDeleteUserAgentText2}</Button>
                          :
                          null}
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

export default AgentList
