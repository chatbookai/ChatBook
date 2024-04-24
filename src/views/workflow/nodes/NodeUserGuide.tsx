// ** React Imports
import React, { Fragment, useState } from 'react'

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

import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { NodeProps } from 'reactflow'
import { FlowModuleItemType } from 'src/functions/workflow/type'

import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'

import TTS from 'src/views/workflow/components/TTS'
import GlobalVariableModel from 'src/views/workflow/components/GlobalVariable'

const QuestionInputNode = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs } = data;
  const { t } = useTranslation()

  console.log("QuestionInputNode moduleId", moduleId)
  console.log("QuestionInputNode outputs", outputs)
  console.log("QuestionInputNode data", data)
  console.log("QuestionInputNode selected", selected)

  const [TTSModel,setTTSModel] = useState<any>({TTSOpen: false, TTSValue: 'Disabled', TTSSpeed: 1})
  const [GlobalVariable,setGlobalVariable] = useState<any>({GlobalVariableOpen: false, 
                                                required: true, 
                                                VariableName: 'Label', 
                                                VariableValue: '',
                                                VariableKey: '',
                                                VariableType: 'text',
                                                TextMaxLength: 50,
                                                SelectOptions: ''
                                              })
  
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
            {data && data.inputs && data.inputs.length>0 && data.inputs.map((item: any, index: number) => {

                return (<Fragment key={`inputs_${index}`}>

                        {item.key == 'welcomeText' ?
                        <Fragment>
                          <Grid item sx={{pt:4}} xs={12}>
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
                              value={t(item.value) as string}
                              style={{ width: '100%', resize: 'both'}}
                              onChange={(e) => {
                                console.log("e", e)
                              }}
                            />
                          </Grid>
                        </Fragment>
                        :
                        null}

                        {item.key == 'variables' ?
                        <Fragment>
                          <Grid item sx={{pt: 7, pb: 1}} xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/app/simpleMode/variable.svg'} variant="rounded" sx={{ width: '32px', height: '32px'}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('variableTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                              <Box position={'absolute'} right={'10px'}>
                                <Button variant='outlined' size="small" startIcon={<Icon icon='mdi:add' />} onClick={
                                  () => { setGlobalVariable( (prevState: any) => ({ ...prevState, GlobalVariableOpen: true }) ) }
                                }>
                                {t("Add")}
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                          </Grid>
                          <GlobalVariableModel GlobalVariable={GlobalVariable} setGlobalVariable={setGlobalVariable} ModelData={item} />
                        </Fragment>
                        :
                        null}

                        {item.key == 'questionGuide' ?
                        <Fragment>
                          <Grid item xs={12}>
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
                          <Grid item xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('ttsTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                              <Box position={'absolute'} right={'10px'}>
                                <Button variant='outlined' size="small" onClick={
                                  () => { setTTSModel( (prevState: any) => ({ ...prevState, TTSOpen: true }) ) }
                                }>
                                  {t(TTSModel.TTSValue) as string}
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                          </Grid>
                          <TTS TTSModel={TTSModel} setTTSModel={setTTSModel} ModelData={item} />
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
