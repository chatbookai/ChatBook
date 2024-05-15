// ** React Imports
import React, { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'

import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import TTS from 'src/views/app/components/TTS'
import GlobalVariableModel from 'src/views/app/components/GlobalVariable'

import LLMModelModel from 'src/views/app/components/LLMModel'
import MyDatasetModel from 'src/views/app/components/MyDataset'
import DatasetPromptModel from 'src/views/app/components/DatasetPrompt'
import TextField2 from 'src/context/TextField2'

const SimpleEditApplication = ({ app, setApp, isDisabledButton, handleEditApp }: any) => {
  
  const { t } = useTranslation()

  const [chatNodeData, setChatNodeData] = useState<any>(app.modules[2].data)
  const [userGuideData, setUserGuideData] = useState<any>(app.modules[0].data)

  console.log("SimpleEditApplication app", app)
  console.log("SimpleEditApplication chatNodeData", chatNodeData)
  console.log("SimpleEditApplication userGuideData", userGuideData)

  const [MyDataset, setMyDataset] = useState<any>({MyDatasetOpen: false, MyDatasetList:[]})
  const [DatasetPrompt, setDatasetPrompt] = useState<any>({DatasetPromptOpen: false, REPHRASE_TEMPLATE: '', QA_TEMPLATE: ''})
  const [LLMModel, setLLMModel] = useState<any>({LLMModelOpen: false, 
                                                model: 'gpt-3.5-turbo', 
                                                name: 'Chatgpt-3.5',
                                                quoteMaxToken: 2, 
                                                maxContext: 16000,
                                                functionCall: true,
                                                temperature: 0,
                                                maxResponse: 4000,
                                                maxChatHistories: 6,
                                                charsPointsPrice: 2
                                              })
  const [TTSModel, setTTSModel] = useState<any>({TTSOpen: false, TTSValue: 'Disabled', TTSSpeed: 1})
  const [GlobalVariable, setGlobalVariable] = useState<any>({GlobalVariableOpen: false, 
                                                required: true, 
                                                VariableName: 'Label', 
                                                VariableValue: '',
                                                VariableKey: '',
                                                VariableType: 'text',
                                                TextMaxLength: 50,
                                                SelectOptions: ''
                                                })
  useEffect(() => {
    const TTSNode: any = app.modules[0].data.inputs
    if(TTSNode && t!=null) {
      TTSNode.map((itemNode: any)=>{
        if(itemNode.key == 'tts') {
          console.log("setTTSModel Default", itemNode)
          setTTSModel( () => ({ TTSOpen: false, TTSValue: itemNode.value, TTSSpeed: itemNode.speed }) );
        }
      })
    }
    const ChatNodeInitial: any = app.modules[2].data.inputs
    if(ChatNodeInitial && t!=null) {
      ChatNodeInitial.map((itemNode: any)=>{
        if(itemNode.type == 'AiModel') {
          console.log("setLLMModel Default", itemNode)
          setLLMModel( () => ({ ...itemNode.LLMModel, LLMModelOpen: false }) );
        }
        if(itemNode.type == 'Dataset' && itemNode.MyDataSet) {
          console.log("setMyDataset Default", itemNode)
          setMyDataset( () => ({ ...itemNode.MyDataSet, MyDatasetOpen: false }) );
        }
        if(itemNode.type == 'Dataset') {
          console.log("setDatasetPrompt Default", itemNode)
          const DatasetTemp = {...itemNode.DatasetPrompt}
          if(!DatasetTemp.REPHRASE_TEMPLATE) {
            DatasetTemp.REPHRASE_TEMPLATE = t('REPHRASE_TEMPLATE_CONTENT')
          }
          if(!DatasetTemp.QA_TEMPLATE) {
            DatasetTemp.QA_TEMPLATE = t('QA_TEMPLATE_CONTENT')
          }
          console.log("setDatasetPrompt Default", DatasetTemp)
          setDatasetPrompt( () => ({ ...DatasetTemp, DatasetPromptOpen: false }) );
        }
      })
    }
  }, [t])

  useEffect(() => {
    if(userGuideData) {
      const appNew = {...app}
      appNew.modules[0].data = userGuideData
      setApp(appNew)
    }
  }, [userGuideData])

  useEffect(() => {
    if(chatNodeData) {
      const appNew = {...app}
      appNew.modules[2].data = chatNodeData
      setApp(appNew)
    }
  }, [chatNodeData])

  const handleAiModelChange = (index: number, LLMModel: any) => {
    setChatNodeData((prevState: any)=>{
      const updatedInputs = [...prevState.inputs]; 
      const ItemData: any = updatedInputs[index];
      const updatedItemData: any = {  ...ItemData, value: LLMModel.model, LLMModel };
      updatedInputs[index] = updatedItemData;
      const newState = { ...prevState, inputs: updatedInputs };

      console.log("handleAiModelChange updatedItemData", updatedItemData, LLMModel.model)

      return newState;
    })
  }

  const handleTTSChange = (index: number, value: string, speed: number) => {
    setUserGuideData((prevState: any)=>{
      const updatedInputs = [...prevState.inputs]; 
      const ItemData: any = updatedInputs[index];
      const updatedItemData: any = { ...ItemData, value, speed };
      updatedInputs[index] = updatedItemData;
      const newState = { ...prevState, inputs: updatedInputs };

      return newState;
    })
  }

  const handleMyDatasetChange = (index: number, MyDataSet: any) => {
    setChatNodeData((prevState: any)=>{
      const updatedInputs = [...prevState.inputs]; 
      const ItemData: any = updatedInputs[index];
      const updatedItemData: any = {  ...ItemData, MyDataSet };
      updatedInputs[index] = updatedItemData;
      const newState = { ...prevState, inputs: updatedInputs };

      console.log("handleMyDatasetChange updatedItemData", updatedItemData, MyDataSet)

      return newState;
    })
  }

  const handleDatasetPromptChange = (index: number, DatasetPrompt: any) => {
    setChatNodeData((prevState: any)=>{
      const updatedInputs = [...prevState.inputs]; 
      const ItemData: any = updatedInputs[index];
      const updatedItemData: any = {  ...ItemData, DatasetPrompt };
      updatedInputs[index] = updatedItemData;
      const newState = { ...prevState, inputs: updatedInputs };

      console.log("handleDatasetPromptChange updatedItemData", updatedItemData, DatasetPrompt)

      return newState;
    })
  }

  return (
        <Grid container spacing={2}>
          <Card sx={{ border: theme => `1px solid ${theme.palette.divider}`, mt: 2, ml: 3, mr: 3, p: 2 }}>
            <Grid container spacing={2} pb={5}>
              {chatNodeData && chatNodeData.inputs && chatNodeData.inputs.length>0 && chatNodeData.inputs.map((item: any, index: number) => {

                  return (<Fragment key={`inputs_${index}`}>
                          {item.type == 'AiModel' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                <Typography sx={{ pl: 2, py: 2 }}>{t(item.label)}</Typography>
                                {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
                                </Box>
                                <Button size="small" onClick={
                                      () => { 
                                        setLLMModel( (prevState: any) => ({ ...prevState, LLMModelOpen: true }) ) 
                                      }
                                    }>
                                      {LLMModel.model}
                                </Button>
                              </Box>
                              <LLMModelModel LLMModel={LLMModel} setLLMModel={setLLMModel} ModelData={item} handleAiModelChange={handleAiModelChange} index={index}/>
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'Dataset' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" pt={2} alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                  <Typography sx={{ pl: 2, py: 2 }}>{t(item.label || item.key)}</Typography>
                                  {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
                                  <Tooltip title={t(item.description)}>
                                    <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                                  </Tooltip>
                                </Box>
                                <Box display="flex" alignItems="center">
                                  <Button size="small" startIcon={<Icon icon='mdi:plus'/>} onClick={
                                        () => { 
                                          setMyDataset( (prevState: any) => ({ ...prevState, MyDatasetOpen: true }) ) 
                                        }
                                      }>
                                        {t('Select dataset')}
                                  </Button>
                                  <Button size="small" startIcon={<Icon icon='mdi:plus'/>} onClick={
                                        () => { 
                                          setDatasetPrompt( (prevState: any) => ({ ...prevState, DatasetPromptOpen: true }) ) 
                                        }
                                      }>
                                        {t('Setting quote prompt')}
                                  </Button>
                                </Box>
                              </Box>
                              <Box mb={1} pt={2}>
                                {MyDataset && MyDataset.MyDatasetList && MyDataset.MyDatasetList.map((item: any, index: number)=>{

                                  return (
                                    <Fragment>
                                      <Button sx={{mb:1, ml:1}} variant='outlined' size="small" startIcon={<Icon icon='material-symbols:database-outline' />}>
                                        {item.name}
                                      </Button>
                                    </Fragment>
                                  )
                                })}
                              </Box>
                              <MyDatasetModel MyDataset={MyDataset} setMyDataset={setMyDataset} ModelData={item} handleMyDatasetChange={handleMyDatasetChange} index={index}/>
                              <DatasetPromptModel DatasetPrompt={DatasetPrompt} setDatasetPrompt={setDatasetPrompt} ModelData={item} handleDatasetPromptChange={handleDatasetPromptChange} index={index}/>
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'Textarea' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" mb={1} alignItems="center">
                                
                                <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                                <Tooltip title={t(item.placeholder)} >
                                  <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1, pt: 1.3 }} />
                                </Tooltip>
                              </Box>
                              <TextField2
                                multiline
                                rows={6}
                                value={item.value || ''}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(item.placeholder) as string}
                                onChange={(e: any) => {
                                    setChatNodeData((prevState: any)=>{
                                        const updatedInputs = [...prevState.inputs]; 
                                        const ItemData: any = updatedInputs[index];
                                        const updatedItemData: any = { ...ItemData, value: e.target.value as string };
                                        updatedInputs[index] = updatedItemData;
                                        const newState = { ...prevState, inputs: updatedInputs };

                                        return newState;
                                    })
                                }}
                              />
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'NumberInput' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                                {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
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
                                InputProps={{ inputProps: { min: item.min, max: item.max } }}
                                value={item.value || 6}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(item.placeholder) as string}
                                onChange={(e: any) => {
                                    setChatNodeData((prevState: any)=>{
                                        const updatedInputs = [...prevState.inputs]; 
                                        const ItemData: any = updatedInputs[index];
                                        const updatedItemData: any = { ...ItemData, value: e.target.value as string };
                                        updatedInputs[index] = updatedItemData;
                                        const newState = { ...prevState, inputs: updatedInputs };

                                        return newState;
                                    })
                                }}
                              />
                            </Grid>
                          </Fragment>
                          :
                          null}
                          
                          </Fragment>)
              })
              }

              {userGuideData && userGuideData.inputs && userGuideData.inputs.length>0 && userGuideData.inputs.map((item: any, index: number) => {

                return (<Fragment key={`inputs_${index}`}>

                        {item.key == 'WelcomeText' ?
                        <Fragment>
                        <Grid item sx={{pt:4}} xs={12}>
                            <Box display="flex" mb={1} alignItems="center">
                            <Avatar src={'/icons/core/modules/WelcomeText.svg'} variant="rounded" sx={{ width: '32px', height: '32px', '& svg':  {
                                                                stroke: '#E74694'
                                                                } }} />
                            <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                            <Tooltip title={t('welcomeTextTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                            </Tooltip>
                            </Box>
                            <TextField2
                                multiline
                                rows={4}
                                value={t(item.value) as string}
                                style={{ width: '100%', resize: 'both'}}
                                onChange={(e: any) => {
                                    setUserGuideData((prevState: any)=>{
                                        const updatedInputs = [...prevState.inputs]; 
                                        const ItemData: any = updatedInputs[index];
                                        const updatedItemData: any = { ...ItemData, value: e.target.value as string };
                                        updatedInputs[index] = updatedItemData;
                                        const newState = { ...prevState, inputs: updatedInputs };

                                        return newState;
                                    })
                                }}
                            />
                        </Grid>
                        </Fragment>
                        :
                        null}

                        {item.key == 'Variables' ?
                        <Fragment>
                        <Grid item sx={{pt: 7, pb: 1}} xs={8}>
                            <Box display="flex" mb={1} alignItems="center">
                                <Avatar src={'/icons/core/app/simpleMode/variable.svg'} variant="rounded" sx={{ width: '32px', height: '32px'}} />
                                <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                                <Tooltip title={t('variableTip')}>
                                    <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item sx={{pt: 7, pb: 1}} xs={4}>
                            <Box display="flex" mb={1} justifyContent="flex-end">
                                <Box right={'10px'}>
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

                        {item.key == 'QuestionGuide' ?
                        <Fragment>
                        <Grid item xs={8}>
                            <Box display="flex" mb={1} alignItems="center">
                                <Avatar src={'/icons/core/chat/QGFill.svg'} variant="rounded" sx={{ width: '28px', height: '28px'}} />
                                <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                                <Tooltip title={t('questionGuideTip')}>
                                    <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box display="flex" mb={1} justifyContent="flex-end">
                                <Box right={'10px'}>
                                    <Switch 
                                        checked={!!item.value} 
                                        onChange={(e: any) => {
                                            setUserGuideData((prevState: any)=>{
                                                const updatedInputs = [...prevState.inputs]; 
                                                const ItemData: any = updatedInputs[index];
                                                const updatedItemData: any = { ...ItemData, value: !!e.target.checked };
                                                updatedInputs[index] = updatedItemData;        
                                                const newState = { ...prevState, inputs: updatedInputs };

                                                return newState;
                                            })
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                        </Grid>
                        </Fragment>
                        :
                        null}

                        {item.key == 'TTS' ?
                        <Fragment>
                        <Grid item xs={8}>
                            <Box display="flex" mb={1} alignItems="center">
                                <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                                <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                                <Tooltip title={t('ttsTip')}>
                                    <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box display="flex" mb={1} justifyContent="flex-end">
                                <Box right={'10px'}>
                                    <Button variant='outlined' size="small" onClick={
                                        () => { 
                                            setTTSModel( (prevState: any) => ({ ...prevState, TTSOpen: true, index: index }) );
                                        }
                                    }>
                                    {t(TTSModel.TTSValue) as string}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                        </Grid>
                        <TTS TTSModel={TTSModel} setTTSModel={setTTSModel} ModelData={item} handleTTSChange={handleTTSChange} index={index}/>
                        </Fragment>
                        :
                        null}

                        </Fragment>)
                })
                }
                <Grid item xs={12} container justifyContent="flex-end" sx={{mt: 2}}>
                    <Button type='submit' variant='contained' size='small' onClick={()=>{handleEditApp()}} disabled={isDisabledButton} >
                      {t('Submit')}
                    </Button>
                </Grid>
            </Grid>
          </Card>

        </Grid>
  );
};


export default React.memo(SimpleEditApplication);
