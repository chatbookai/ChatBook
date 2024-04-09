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

const NodeChatNode = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs, inputs } = data;
  const { t } = useTranslation()
  const [, startTst] = useTransition();

  console.log("NodeChatNode moduleId", moduleId)
  console.log("NodeChatNode inputs", inputs)
  console.log("NodeChatNode outputs", outputs)
  console.log("NodeChatNode data", data)

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
                <Avatar src={data.avatar} sx={{ mr: 2.5, width: 36, height: 36 }} />
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

        <Fragment>
          <Grid container spacing={[5, 0]}>
            <Box display="flex" mb={1} alignItems="center" justifyContent="space-between">
              <Box position={'absolute'} left={'-2px'}>
                <Handle
                  style={{
                    width: '14px',
                    height: '14px',
                    borderWidth: '3.5px',
                    backgroundColor: 'info.primary',
                    top: '-3px'
                  }}
                  type="target"
                  id={`Triger_Left`}
                  position={Position.Left}
                />
              </Box>
              <Box display="flex" alignItems="center">
                <Typography sx={{ pl: 3, pb: 2 }}>{t('switch')}</Typography>
              </Box>
              <Typography sx={{ pr: 3, pb: 2 }}>{t('running done')}</Typography>
              <Box position={'absolute'} right={'-2px'}>
              <Handle
                style={{
                  width: '14px',
                  height: '14px',
                  borderWidth: '3.5px',
                  backgroundColor: 'info.primary',
                  top: '-3px'
                }}
                type="source"
                id={`Triger_Right`}
                position={Position.Right}
              />
            </Box>
            </Box>
          </Grid>
        </Fragment>

        <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
        <Grid item xs={12} sx={{ py: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {t("Inputs")}
            </Typography>
        </Grid>
        <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
        
        <Grid container spacing={2} pb={5}>
          {data && data.inputs && data.inputs.length>0 && data.inputs.map((item: any, index: number) => {

              return (<Fragment key={`inputs_${index}`}>
                      {item.type == 'settingLLMModel' ?
                      <Fragment>
                        <Grid item sx={{pt:4}} xs={12}>
                        <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                          <Typography sx={{ pl: 2, py: 2 }}>{t(item.label)}</Typography>
                          {item && item.required && <span style={{ color: 'red', marginLeft: '0.5rem' }}>*</span>}
                          </Box>
                          <Button size="small">{item.value}</Button>
                        </Box>
                        </Grid>
                      </Fragment>
                      :
                      null}

                      {item.type == 'settingDatasetQuotePrompt' ?
                      <Fragment>
                        <Grid item sx={{pt:4}} xs={12}>
                        <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="space-between">
                          <Box position={'absolute'} left={'-2px'}>
                            <Handle
                              style={{
                                width: '14px',
                                height: '14px',
                                borderWidth: '3.5px',
                                backgroundColor: 'info.primary',
                              }}
                              type="target"
                              id={`${item.label}${index}'_Left'`}
                              position={Position.Left}
                            />
                          </Box>
                          <Box display="flex" alignItems="center">
                          <Typography sx={{ pl: 3, py: 2 }}>{t(item.label || item.key)}</Typography>
                          {item && item.required && <span style={{ color: 'red', marginLeft: '0.5rem' }}>*</span>}
                          <Tooltip title={t(item.description)}>
                              <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                            </Tooltip>
                          </Box>
                          <Button size="small">{t('Setting quote prompt')}</Button>
                        </Box>
                        </Grid>
                      </Fragment>
                      :
                      null}

                      {item.type == 'textarea' ?
                      <Fragment>
                        <Grid item sx={{pt:4}} xs={12}>
                          <Box display="flex" mb={1} alignItems="center">
                            <Box position={'absolute'} left={'-2px'}>
                              <Handle
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderWidth: '3.5px',
                                  backgroundColor: 'info.primary',
                                  top: '2px'
                                }}
                                type="target"
                                id={`${item.label}${index}'_Left'`}
                                position={Position.Left}
                              />
                            </Box>
                            <Typography sx={{pl: 3, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                            <Tooltip title={t(item.placeholder)} >
                              <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1, pt: 1.3 }} />
                            </Tooltip>
                          </Box>
                          <TextField
                            multiline
                            rows={4}
                            defaultValue={item.value}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t(item.placeholder) as string}
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

                      {item.type == 'numberInput' ?
                      <Fragment>
                        <Grid item sx={{pt:4}} xs={12}>
                          <Box display="flex" mb={1} alignItems="center">
                            <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                            {item && item.required && <span style={{ color: 'red', marginLeft: '0.5rem' }}>*</span>}
                            {item.placeholder ?
                            <Tooltip title={t(item.placeholder)}>
                              <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                            </Tooltip>                              
                            :
                            null}
                          </Box>
                          <TextField
                            type='number'
                            size='small'
                            defaultValue={item.value}
                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                            placeholder={t(item.placeholder) as string}
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

                      {item.type == 'custom' && item.key == 'userChatInput' ?
                      <Fragment>
                        <Grid item sx={{pt:4}} xs={12}>
                          <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="space-between">
                            <Box position={'absolute'} left={'-2px'}>
                              <Handle
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderWidth: '3.5px',
                                  backgroundColor: 'info.primary',
                                }}
                                type="target"
                                id={`${item.label}${index}'_Left'`}
                                position={Position.Left}
                              />
                            </Box>
                            <Box display="flex" alignItems="center">
                              <Typography sx={{ pl: 3, py: 2 }}>{t(item.toolDescription)}</Typography>
                              {item && item.required && <span style={{ color: 'red', marginLeft: '0.5rem' }}>*</span>}
                            </Box>
                            <Typography sx={{ pr: 3, py: 2 }}>{t(item.toolDescription)}</Typography>
                            <Box position={'absolute'} right={'-2px'}>
                            <Handle
                              style={{
                                width: '14px',
                                height: '14px',
                                borderWidth: '3.5px',
                                backgroundColor: 'info.primary',
                              }}
                              type="source"
                              id={`${item.label}${index}'_Right'`}
                              position={Position.Right}
                            />
                          </Box>
                          </Box>
                        </Grid>
                      </Fragment>
                      :
                      null}

                      {item.key == 'variables' ?
                      <Fragment>
                        <Grid item sx={{pt: 7, pb: 1}} xs={12}>
                          <Box display="flex" mb={1} alignItems="center">
                            <Avatar src={'/icons/core/app/simpleMode/variable.svg'} variant="rounded" sx={{ width: '32px', height: '32px'}} />
                            <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
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
                        <Grid item xs={12}>
                          <Box display="flex" mb={1} alignItems="center">
                            <Avatar src={'/icons/core/chat/QGFill.svg'} variant="rounded" sx={{ width: '28px', height: '28px'}} />
                            <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
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
                        <Grid item xs={12}>
                          <Box display="flex" mb={1} alignItems="center">
                            <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                            <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
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
                            <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
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
                                  {llms && llms.audioSpeechModels && llms.audioSpeechModels[0] && llms.audioSpeechModels[0].voices && llms.audioSpeechModels[0].voices.map((item: any, indexItem: number)=>{
                                    return <MenuItem value={item.value} key={`voices_${indexItem}`}>{item.label}</MenuItem>
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

        <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
        <Grid item xs={12} sx={{ py: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {t("Outputs")}
            </Typography>
        </Grid>
        <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />

        <Grid container spacing={2}>
          {data && data.outputs && data.outputs.length>0 && data.outputs.map((item: any, index: number) => {

              return (<Fragment key={`outputs_${index}`}>
                      {item.type == 'source' ?
                      <Fragment>
                        <Grid item xs={12}>
                          <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="flex-end">
                            <Typography sx={{ pr: 3, py: 2 }}>{t(item.label)}</Typography>
                          </Box>
                          <Box position={'absolute'} right={'-2px'}>
                            <Handle
                              style={{
                                width: '14px',
                                height: '14px',
                                borderWidth: '3.5px',
                                backgroundColor: 'info.primary',
                                top: '-22px',
                              }}
                              type="source"
                              id={`${item.label}${index}`}
                              position={Position.Right}
                            />
                          </Box>
                        </Grid>
                      </Fragment>
                      :
                      null}

              </Fragment>)
          })
          }
        </Grid>


      </Card>
  );
};


export default React.memo(NodeChatNode);
