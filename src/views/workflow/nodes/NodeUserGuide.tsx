// ** React Imports
import React, { ReactElement, Fragment, useTransition, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Slider from '@mui/material/Slider'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import toast from 'react-hot-toast'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { NodeProps, Handle, Position } from 'reactflow'
import { FlowModuleItemType } from 'src/functions/workflow/type'
import { llms } from 'src/functions/llms'

import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

const QuestionInputNode = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs } = data;
  const { t } = useTranslation()
  const [, startTst] = useTransition();

  console.log("QuestionInputNode moduleId", moduleId)
  console.log("QuestionInputNode outputs", outputs)
  console.log("QuestionInputNode data", data)

  const [TTSOpen, setTTSOpen] = useState<boolean>(false)
  const [TTSValue, setTTSValue] = useState<string>("Disabled")
  const [TTSSpeed, setTTSSpeed] = useState<number>(1)
  
  const handleClickTTSOpen = () => {
    setTTSOpen(true)
  }

  const handleTTSClose = () => {
    setTTSOpen(false)
  }
  
  return (
    <Card sx={{ border: theme => `1px solid ${theme.palette.divider}`, width: '500px' }}>
        <CardHeader
          title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={data.avatar} sx={{ mr: 2.5, width: 40, height: 40 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>{t(data.name) as string}</Typography>
              </Box>
            }
          subheader={
            <Typography variant='subtitle1'>
              {t(data.intro) as string}
            </Typography>
          }
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: '2rem !important',
              letterSpacing: '0.15px !important'
            }
          }}
        />
        <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={2}>
            {data && data.inputs && data.inputs.length>0 && data.inputs.map((item: any) => {

                return (<Fragment>

                        {item.key == 'welcomeText' ?
                        <Fragment>
                          <Grid item spacing={[5, 0]} sx={{pt:4}} xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/modules/welcomeText.svg'} variant="rounded" sx={{ width: '32px', height: '32px', '& svg':  {
                                                                stroke: '#E74694'
                                                                } }} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('welcomeTextTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                            </Box>
                            <TextField
                              multiline
                              rows={4}
                              defaultValue={item.value}
                              style={{ width: '100%', resize: 'both'}}
                              placeholder={item.value}
                              onChange={(e) => {
                                startTst(() => {
                                  //Action
                                });
                              }}
                            />
                          </Grid>
                        </Fragment>
                        :
                        null}

                        {item.key == 'variables' ?
                        <Fragment>
                          <Grid item spacing={[5, 5]} sx={{pt: 7, pb: 1}} xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/app/simpleMode/variable.svg'} variant="rounded" sx={{ width: '32px', height: '32px'}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('variableTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                              <Box position={'absolute'} right={'10px'}>
                                <Button variant='outlined' size="small" startIcon={<Icon icon='mdi:add' />} >
                                {t("Add")}
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                          </Grid>
                        </Fragment>
                        :
                        null}

                        {item.key == 'questionGuide' ?
                        <Fragment>
                          <Grid item spacing={[5, 5]} xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/chat/QGFill.svg'} variant="rounded" sx={{ width: '28px', height: '28px'}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('questionGuideTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                              <Box position={'absolute'} right={'10px'}>
                                <Switch defaultChecked />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                          </Grid>
                        </Fragment>
                        :
                        null}

                        {item.key == 'tts' ?
                        <Fragment>
                          <Grid item spacing={[5, 5]} xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('ttsTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                              <Box position={'absolute'} right={'10px'}>
                                <Button variant='outlined' size="small" onClick={handleClickTTSOpen}>
                                  {t(TTSValue) as string}
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                          </Grid>
                          <Dialog maxWidth='xs' fullWidth open={TTSOpen} onClose={handleTTSClose}>
                            <DialogTitle>
                            <Box display="flex" alignItems="center">
                              <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Box position={'absolute'} right={'5px'} top={'1px'}>
                                <IconButton size="small" edge="end" onClick={handleTTSClose} aria-label="close">
                                  <CloseIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            </DialogTitle>
                            <DialogContent sx={{  }}>
                              <Grid item xs={12}>
                                <FormControl sx={{ mt: 4, mr: 4 }}>
                                  <InputLabel id='demo-dialog-select-label'>{t("TTSModel")}</InputLabel>
                                  <Select 
                                    size="small" 
                                    label={t("Tts")}
                                    labelId='demo-dialog-select-label' 
                                    id='demo-dialog-select' 
                                    defaultValue={TTSValue} 
                                    value={TTSValue}
                                    fullWidth
                                    onChange={(e: any) => {
                                      if(e.target.value) {
                                        setTTSValue(e.target.value as string)
                                      }
                                    }}
                                    >
                                    <MenuItem value={"Disabled"}>{t("Disabled")}</MenuItem>
                                    <MenuItem value={"AudioBrowser"}>{t("AudioBrowser")}</MenuItem>
                                    {llms && llms.audioSpeechModels && llms.audioSpeechModels[0] && llms.audioSpeechModels[0].voices && llms.audioSpeechModels[0].voices.map((item: any)=>{
                                      return <MenuItem value={item.value}>{item.label}</MenuItem>
                                    })}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={11.8} pt={8}>
                              <Typography sx={{ fontWeight: 500 }}>{t("TTSSpeed")}</Typography>
                              <Slider
                                size="small"
                                min={0.3}
                                max={2}
                                step={0.1}
                                onChange={(e: any) => {
                                  if(e.target.value) {
                                    setTTSSpeed(Number(e.target.value as string))
                                  }
                                }}
                                value={TTSSpeed}
                                valueLabelDisplay='on'
                                aria-labelledby="custom-marks-slider"
                                marks={[
                                  {
                                    value: 0.3,
                                    label: '0.3'
                                  },
                                  {
                                    value: 2,
                                    label: '2'
                                  }
                                  ]}
                              />
                              </Grid>
                            </DialogContent>
                            <DialogActions>
                              <Button size="small" variant='contained' startIcon={<Icon icon='arcticons:ds-audio' />}>
                                {t("TrialListening")}
                              </Button>
                              <Button size="small" variant='outlined' onClick={handleTTSClose}>
                                {t("Close")}
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Fragment>
                        :
                        null}

                        </Fragment>)
            })
            }
          </Grid>


          
        </CardContent>
      </Card>
  );
};


export default React.memo(QuestionInputNode);
