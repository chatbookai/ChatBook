// ** React Imports
import React, { Fragment, useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Slider from '@mui/material/Slider'
import Fab from '@mui/material/Fab'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { NodeProps, Handle, Position } from 'reactflow'
import { FlowModuleItemType } from 'src/functions/app/type'
import { llms } from 'src/functions/llms'

import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { FlowContext } from '../advanced/FlowContext';
import { getNanoid } from 'src/functions/app/string.tools';

import LLMModelModel from 'src/views/app/components/LLMModel'

const NodeContentExtract = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs, inputs, name, id } = data;
  const { t } = useTranslation()
  

  const { setNodes, nodes, setEdges, edges } = useContext(FlowContext);

  console.log("NodeContentExtract moduleId", selected, id, name, moduleId, inputs, outputs)
  console.log("NodeContentExtract data", data)


  const [TTSOpen, setTTSOpen] = useState<boolean>(false)
  const [RenameOpen, setRenameOpen] = useState<boolean>(false)
  const [TTSValue, setTTSValue] = useState<string>("Disabled")
  const [TTSSpeed, setTTSSpeed] = useState<number>(1)
  const [NodeTitle, setNodeTitle] = useState<string>("")

  //const [TTSModel,setTTSModel] = useState<any>({TTSOpen: false, TTSValue: 'Disabled', TTSSpeed: 1})

  const [LLMModel,setLLMModel] = useState<any>({LLMModelOpen: false, 
                                                model: 'gpt-3.5-turbo', 
                                                quoteMaxToken: 2, 
                                                maxContext: 16000,
                                                functionCall: true,
                                                temperature: 0,
                                                maxResponse: 4000,
                                                maxChatHistories: 6,
                                                charsPointsPrice: 2
                                              })
  
  const handleClickTTSOpen = () => {
    setTTSOpen(true)
  }

  const handleTTSClose = () => {
    setTTSOpen(false)
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePopoverOpen = () => {
    setIsOpen(true);
  };

  const handlePopoverClose = () => {
    setIsOpen(false);
  };

  const handleRenameNode = (nodeId: string) => {
    const updatedNodes = nodes.map((node: any) => {
      if (node.id == nodeId) {

        return {
          ...node,
          data: {
            ...node.data,
            name: NodeTitle
          }
        };
      }

      return node;
    });
    setNodes(updatedNodes);
    setRenameOpen(false);
  };

  const handleCopyNode = (nodeId: string) => {
    const getNanoidValue = getNanoid(6);
    const copyNodes = nodes.map((node: any) => {
      if (node.id == nodeId) {

        return {
          ...node,
          selected: false
        };
      }

      return node;
    });
    const currentNode1 = copyNodes.filter((node: any) => {

      return node.id == nodeId
    });
    const currentNode2 = currentNode1.map((node: any) => {
      if (node.id == nodeId) {

        return {
          ...node,
          data: {
            ...node.data,
            id: getNanoidValue
          },
          position: {
            x: node.position.x + 200,
            y: node.position.y + 80,
          },
          positionAbsolute: {
            x: node.position.x + 200,
            y: node.position.y + 80,
          },
          id: getNanoidValue,
          selected: true
        };
      }
      else {

        return node;
      }
    });
    const updatedNodes = copyNodes.concat(currentNode2);
    setNodes(updatedNodes);

    //console.log("handleCopyNode", nodeId, copyNodes, currentNode1)
    //console.log("handleCopyNode updatedNodes", updatedNodes)
  };

  const handleDeleteNode = (nodeId: string) => {
    const DeletedNodes = nodes.filter((node: any) => {
      return node.id != nodeId;
    });
    setNodes(DeletedNodes);
  };

  const handleDeleteNodeClassifyQuestionItem = (nodeId: string, valueItem: any, index: number, type: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index].value;
            const DeletedNodeValues = nodeValues.filter((nodeValue: any) => {
                return nodeValue.key != valueItem.key;
            });
            nodeInputsOrOutputs[index].value = DeletedNodeValues
            node.data[type] = nodeInputsOrOutputs

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleEditNodeClassifyQuestionItem = (nodeId: string, valueItem: any, index: number, type: string, field: string, value: string | boolean) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index].value;
            const EditNodeValues = nodeValues.filter((nodeValue: any) => {
                if(nodeValue.key == valueItem.key) {
                    const nodeValueNew = nodeValue
                    nodeValueNew[field] = value

                    return nodeValueNew
                }
                else {

                    return nodeValue;
                }
            });
            nodeInputsOrOutputs[index].value = EditNodeValues
            node.data[type] = nodeInputsOrOutputs

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleNewNodeClassifyQuestionItem = (nodeId: string, index: number, type: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index].value;
            nodeValues.push({key: getNanoid(6), value: ''})
            nodeInputsOrOutputs[index].value = nodeValues
            node.data[type] = nodeInputsOrOutputs

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleDeleteNodeContentExtractItem = (nodeId: string, valueItem: any, index: number, type: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index].value;
            const DeletedNodeValues = nodeValues.filter((nodeValue: any) => {

                return nodeValue.key != valueItem.key;
            });
            nodeInputsOrOutputs[index].value = DeletedNodeValues
            node.data[type] = nodeInputsOrOutputs

            //console.log("DeletedNodeValues", nodeInputsOrOutputs, node)

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleEditNodeContentExtractItem = (nodeId: string, valueItem: any, index: number, type: string, field: string, value: string | boolean) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index].value;
            const EditNodeValues = nodeValues.filter((nodeValue: any) => {
                if(nodeValue.key == valueItem.key) {
                    const nodeValueNew = nodeValue
                    nodeValueNew[field] = value

                    return nodeValueNew
                }
                else {

                    return nodeValue;
                }
            });
            nodeInputsOrOutputs[index].value = EditNodeValues
            node.data[type] = nodeInputsOrOutputs

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleNewNodeContentExtractItem = (nodeId: string, index: number, type: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index].value;
            nodeValues.push({key: getNanoid(6), value: '', required: false, default: '', enumValue: ''})
            nodeInputsOrOutputs[index].value = nodeValues
            node.data[type] = nodeInputsOrOutputs

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleEditNodeHttpRequestItem = (nodeId: string, valueItem: any, index: number, type: string, field: string, value: string | boolean, ChangeField: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index][ChangeField];
            if(ChangeField == "valueBody")  {
                nodeInputsOrOutputs[index][ChangeField] = value
                node.data[type] = nodeInputsOrOutputs
            }
            else {
                const EditNodeValues = nodeValues.filter((nodeValue: any) => {
                    if(nodeValue.key == valueItem.key) {
                        const nodeValueNew = nodeValue
                        nodeValueNew[field] = value

                        return nodeValueNew
                    }
                    else {

                        return nodeValue;
                    }
                });
                nodeInputsOrOutputs[index][ChangeField] = EditNodeValues
                node.data[type] = nodeInputsOrOutputs
            }

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleNewNodeHttpRequestItem = (nodeId: string, index: number, type: string, ChangeField: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index][ChangeField];
            nodeValues.push({key: '', value: '', type: 'string'})
            nodeInputsOrOutputs[index][ChangeField] = nodeValues
            node.data[type] = nodeInputsOrOutputs

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  const handleDeleteNodeHttpRequestItem = (nodeId: string, valueItem: any, index: number, type: string, ChangeField: string) =>{
    const ModifyNodes = nodes.map((node: any) => {
        if(node.id == nodeId) {
            const nodeInputsOrOutputs: any[] = node.data[type];
            const nodeValues = nodeInputsOrOutputs[index][ChangeField];
            const DeletedNodeValues = nodeValues.filter((nodeValue: any) => {

                return nodeValue.key != valueItem.key;
            });
            nodeInputsOrOutputs[index][ChangeField] = DeletedNodeValues
            node.data[type] = nodeInputsOrOutputs

            //console.log("DeletedNodeValues", nodeInputsOrOutputs, node)

            return node;
        }
        else {

            return node;
        }
      });
      setNodes(ModifyNodes);
  }

  useEffect(()=>{
    setNodeTitle(t(name) as string)
  }, [t, name])

  /*
  const [InputShow, setInputShow] = useState<boolean>(false)
  const [OutputShow, setOutputShow] = useState<boolean>(false)
  useEffect(()=>{
    inputs && inputs.length > 0 && inputs.map((item: any)=>{
      if(item.type != 'hidden') {
        setInputShow(true)
      }
      console.log("item.type", item.type)
    })
    outputs && outputs.length > 0 && outputs.map((item: any)=>{
      if(item.type != 'hidden') {
        setOutputShow(true)
      }
    })
  }, [])
  */
  const InputShow = true
  const OutputShow = true

  useEffect(()=>{
    if(selected) {
      const updateEdges = edges.map((item: any)=>{
        if(item.target == id) {
          return {
            ...item,
            style: {
              stroke: '#00BFFF',
              strokeWidth: 4
            }
          };
        }
        else {
          return {
            ...item,
            style: {
              stroke: '#808080',
              strokeWidth: 2
            }
          };
        }
      })
      //setEdges(updateEdges)
    }
  }, [selected, setEdges, edges, id])

  const httpMethodList = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  
  return (
        <Grid container spacing={2} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
          <Card sx={{ border: theme => `1px solid ${theme.palette.divider}`, width: '500px' }}>
            <CardHeader
              title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={data.avatar} sx={{ mr: 2.5, width: 36, height: 36 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>{t(name) as string}</Typography>
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
                        backgroundColor: 'white',
                        top: '-3px',
                        left: '-13px',
                        borderColor: '#36ADEF'
                      }}
                      type="target"
                      id={`Triger_Left`}
                      position={Position.Left}
                    />
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ pl: 3, pb: 2, pr: 2 }}>{t('switch')}</Typography>
                  </Box>
                  <Typography sx={{ pr: 3, pb: 2 }}>{t('running done')}</Typography>
                  <Box position={'absolute'} right={'-2px'}>
                  <Handle
                    style={{
                      width: '14px',
                      height: '14px',
                      borderWidth: '3.5px',
                      backgroundColor: 'white',
                      top: '-3px',
                      right: '87px',
                      borderColor: '#36ADEF'
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
            {InputShow ? 
            <Fragment>
              <Grid item xs={12} sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {t("Inputs")}
                  </Typography>
              </Grid>
              <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
            </Fragment>
            :
            null}
            
            <Grid container spacing={2} pb={5}>
              {data && data.inputs && data.inputs.length>0 && data.inputs.map((item: any, index: number) => {

                  return (<Fragment key={`inputs_${index}`}>
                          {item.type == 'selectLLMModel' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                <Typography sx={{ pl: 2, py: 2 }}>{t(item.label)}</Typography>
                                {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
                                </Box>
                                <Button size="small" onClick={
                                      () => { setLLMModel( (prevState: any) => ({ ...prevState, LLMModelOpen: true }) ) }
                                    }>
                                      {LLMModel.model}
                                </Button>
                              </Box>
                              <LLMModelModel LLMModel={LLMModel} setLLMModel={setLLMModel} ModelData={item} />
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
                                    backgroundColor: 'white',
                                    left: '-13px',
                                    borderColor: '#36ADEF'                                    
                                  }}
                                  type="target"
                                  id={`${item.key}_Left`}
                                  position={Position.Left}
                                />
                              </Box>
                              <Box display="flex" alignItems="center">
                              <Typography sx={{ pl: 3, py: 2 }}>{t(item.label || item.key)}</Typography>
                              {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
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
                                      backgroundColor: 'white',
                                      top: '2px',
                                      left: '-13px',
                                      borderColor: '#36ADEF'
                                    }}
                                    type="target"
                                    id={`${item.key}_Left`}
                                    position={Position.Left}
                                  />
                                </Box>
                                <Typography sx={{pl: 3, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                                <Tooltip title={t(item.description)} >
                                  <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1, pt: 1.3 }} />
                                </Tooltip>
                              </Box>
                              <TextField
                                multiline
                                rows={6}
                                value={item.value}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(item.placeholder) as string}
                                onChange={(e: any) => {
                                  setNodes((prevState: any)=>{
                                    const nodesNew = prevState.map((itemNode: any)=>{
                                      if(itemNode.data.id == data.id) {
                                        const targetNode = { ...itemNode }
                                        const ItemData = targetNode.data.inputs[index]
                                        targetNode.data.inputs[index] = { ...ItemData, value: e.target.value as string }
                                        console.log("targetNode", targetNode)
                                        return targetNode
                                      }
                                      else {
                                        return itemNode
                                      }
                                    })
                                    return nodesNew;
                                  })
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
                                InputProps={{ inputProps: { min: 0, max: 100 } }}
                                value={item.value}
                                sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                placeholder={t(item.placeholder) as string}
                                onChange={(e: any) => {
                                  setNodes((prevState: any)=>{
                                    const nodesNew = prevState.map((itemNode: any)=>{
                                      if(itemNode.data.id == data.id) {
                                        const targetNode = { ...itemNode }
                                        const ItemData = targetNode.data.inputs[index]
                                        targetNode.data.inputs[index] = { ...ItemData, value: e.target.value as string }
                                        console.log("targetNode", targetNode)
                                        return targetNode
                                      }
                                      else {
                                        return itemNode
                                      }
                                    })
                                    return nodesNew;
                                  })
                                }}
                              />
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'systemInput' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" mb={1} pt={2} alignItems="center" justifyContent="space-between">
                                <Box position={'absolute'} left={'-2px'}>
                                  <Handle
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      borderWidth: '3.5px',
                                      backgroundColor: 'white',
                                      left: '-13px',
                                      borderColor: '#36ADEF'
                                    }}
                                    type="target"
                                    id={`${item.key}_Left`}
                                    position={Position.Left}
                                  />
                                </Box>
                                <Box display="flex" alignItems="center">
                                  <Typography sx={{ pl: 3, py: 2 }}>{t(item.toolDescription)}</Typography>
                                  {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
                                </Box>
                                <Typography sx={{ pr: 3, py: 2 }}>{t(item.toolDescription)}</Typography>
                                <Box position={'absolute'} right={'-2px'}>
                                <Handle
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    borderWidth: '3.5px',
                                    backgroundColor: 'white',
                                    right: '87px',
                                    borderColor: '#36ADEF'
                                  }}
                                  type="source"
                                  id={`${item.key}_Right`}
                                  position={Position.Right}
                                />
                              </Box>
                              </Box>
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'classifyQuestion' ?
                          <Fragment>
                            {item.value && item.value.length && item.value.map((valueItem: any, valueIndex: number)=>{
                                return (
                                    <Grid key={valueIndex} item sx={{ display: 'flex', alignItems: 'center', pt: 0, pl: 1 }} xs={12}>
                                        <Fab color='primary' aria-label='delete' size='small' sx={{width:'46px'}} onClick={()=>{
                                            handleDeleteNodeClassifyQuestionItem(id, valueItem, index, "inputs")
                                        }}>
                                            <Icon icon='mdi:delete' />
                                        </Fab>
                                        <Typography sx={{ pl: 1, py: 1, pr: 2 }}>{`${valueIndex+1}`}</Typography>
                                        <TextField
                                            multiline
                                            rows={1}
                                            defaultValue={valueItem.value}
                                            sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('Add question item placeholder') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeClassifyQuestionItem(id, valueItem, index, "inputs", "value", e.target.value as string)
                                            }}
                                        />
                                        <Box position={'absolute'} right={'2px'}>
                                            <Handle
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderWidth: '3.5px',
                                                    backgroundColor: 'white',
                                                    top: '0px',
                                                    right: '84px',
                                                    borderColor: '#21ba45'
                                                }}
                                                type="source"
                                                id={`${valueItem.key}_Right`}
                                                position={Position.Right}
                                            />
                                        </Box>
                                    </Grid>
                                )
                            })}

                            <Grid item sx={{ display: 'flex', alignItems: 'center', mt:2, ml: 1 }} xs={12}>
                                <Button variant='contained' size="small" startIcon={<Icon icon='mdi:add' />} onClick={()=>{
                                    handleNewNodeClassifyQuestionItem(id, index, "inputs")
                                }}>
                                    {t('Add question type')}
                                </Button>
                            </Grid>
                            
                          </Fragment>
                          :
                          null}

                          {item.type == 'extractContent' ?
                          <Fragment>
                            <Grid item sx={{pt:4}} xs={12}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Box position={'absolute'} left={'-2px'}>
                                  <Handle
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      borderWidth: '3.5px',
                                      backgroundColor: 'white',
                                      top: '2px',
                                      left: '-13px',
                                      borderColor: '#36ADEF'
                                    }}
                                    type="target"
                                    id={`${item.key}_Left`}
                                    position={Position.Left}
                                  />
                                </Box>
                                <Typography sx={{pl: 3, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                                {item && item.required && <span style={{ paddingTop: '9px', color: 'red', marginLeft: '3px' }}>*</span>}
                              </Box>
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'extractKeys' ?
                          <Fragment>
                            {item.value && item.value.length && item.value.map((valueItem: any, valueIndex: number)=>{

                                return (
                                    <Grid key={valueIndex} item sx={{ display: 'flex', alignItems: 'center', pt: 0, pl: 1 }} xs={12}>
                                        <Fab color='primary' aria-label='delete' size='small' sx={{width:'46px'}} onClick={()=>{
                                            handleDeleteNodeContentExtractItem(id, valueItem, index, "inputs")
                                        }}>
                                            <Icon icon='mdi:delete' />
                                        </Fab>
                                        <Typography sx={{ pl: 1, py: 1, pr: 2 }}>{`${valueIndex+1}`}</Typography>
                                        <TextField
                                            multiline
                                            rows={1}
                                            value={valueItem.key}
                                            sx={{ pr: 2, width: '28%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('key') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeContentExtractItem(id, valueItem, index, "inputs", "key", e.target.value as string)
                                            }}
                                        />
                                        <TextField
                                            multiline
                                            rows={1}
                                            value={valueItem.description}
                                            sx={{ pr: 2, width: '28%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('Description') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeContentExtractItem(id, valueItem, index, "inputs", "description", e.target.value as string)
                                            }}
                                        />
                                        <Switch 
                                            checked={valueItem.required} 
                                            onChange={(e: any)=>{
                                                handleEditNodeContentExtractItem(id, valueItem, index, "inputs", "required", !!e.target.checked)
                                            }}
                                        />
                                        <TextField
                                            multiline
                                            rows={1}
                                            value={valueItem.default}
                                            sx={{ pr: 2, width: '28%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('Default') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeContentExtractItem(id, valueItem, index, "inputs", "default", e.target.value as string)
                                            }}
                                        />
                                        <Box position={'absolute'} right={'2px'}>
                                            <Handle
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderWidth: '3.5px',
                                                    backgroundColor: 'white',
                                                    top: '0px',
                                                    right: '84px',
                                                    borderColor: '#21ba45'
                                                }}
                                                type="source"
                                                id={`${valueItem.key}_Right`}
                                                position={Position.Right}
                                            />
                                        </Box>
                                    </Grid>
                                )
                            })}

                            <Grid item sx={{ display: 'flex', alignItems: 'center', mt:2, ml: 1 }} xs={12}>
                                <Button variant='contained' size="small" startIcon={<Icon icon='mdi:add' />} onClick={()=>{
                                    handleNewNodeContentExtractItem(id, index, "inputs")
                                }}>
                                    {t('Add question type')}
                                </Button>
                            </Grid>
                            
                          </Fragment>
                          :
                          null}

                          {item.key == 'httpMethod' ?
                          <Fragment>
                            <Grid item sx={{pt: 7, pb: 1}} xs={12}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t(item.label) as string}</Typography>
                              </Box>
                            </Grid>
                            <Grid item sx={{pt: 2, pb: 1}} xs={3}>
                                <Select 
                                    size="small"
                                    sx={{mx: 1}}
                                    value={item.value}
                                    fullWidth
                                    onChange={(e: any) => {
                                      setNodes((prevState: any)=>{
                                        const nodesNew = prevState.map((itemNode: any)=>{
                                          if(itemNode.data.id == data.id) {
                                            const targetNode = { ...itemNode }
                                            const ItemData = targetNode.data.inputs[index]
                                            targetNode.data.inputs[index] = { ...ItemData, value: e.target.value as string }
                                            console.log("targetNode Select", targetNode)
                                            return targetNode
                                          }
                                          else {
                                            return itemNode
                                          }
                                        })
                                        return nodesNew;
                                      })
                                    }}
                                    >
                                    {httpMethodList.map((itemHttpMethod: string, indexItem: number)=>{
                                        
                                        return <MenuItem value={itemHttpMethod} key={`${indexItem}`}>{itemHttpMethod}</MenuItem>
                                    })}
                                </Select>
                            </Grid>
                            <Grid item sx={{pt: 2, pb: 1}} xs={9}>
                              <Box display="flex" mb={1} alignItems="center">
                                <TextField
                                    size="small"
                                    value={item.httpReqUrl}
                                    sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                    onChange={(e: any) => {
                                      setNodes((prevState: any)=>{
                                        const nodesNew = prevState.map((itemNode: any)=>{
                                          if(itemNode.data.id == data.id) {
                                            const targetNode = { ...itemNode }
                                            const ItemData = targetNode.data.inputs[index]
                                            targetNode.data.inputs[index] = { ...ItemData, httpReqUrl: e.target.value as string }
                                            console.log("targetNode", targetNode)
                                            return targetNode
                                          }
                                          else {
                                            return itemNode
                                          }
                                        })
                                        return nodesNew;
                                      })
                                    }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                            </Grid>
                          </Fragment>
                          :
                          null}

                          {item.type == 'httpParams' ?
                          <Fragment>
                            <Grid item sx={{pt: 7, pb: 1}} xs={8}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t("Http Params") as string}</Typography>
                              </Box>
                            </Grid>
                            <Grid item sx={{pt: 7, pb: 1}} xs={4}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Button variant='contained' sx={{mt: 1}} size="small" startIcon={<Icon icon='mdi:add' />} onClick={()=>{
                                    handleNewNodeHttpRequestItem(id, index, "inputs", "valueParams")
                                }}>
                                    {t('Add params')}
                                </Button>
                              </Box>
                            </Grid>
                            {item.valueParams && item.valueParams.length && item.valueParams.map((valueItem: any, valueIndex: number)=>{

                                return (
                                    <Grid key={valueIndex} item sx={{ display: 'flex', alignItems: 'center', pt: 0, pl: 1 }} xs={12}>
                                        <Fab color='primary' aria-label='delete' size='small' sx={{width:'46px'}} onClick={()=>{
                                            handleDeleteNodeHttpRequestItem(id, valueItem, index, "inputs", "valueParams")
                                        }}>
                                            <Icon icon='mdi:delete' />
                                        </Fab>
                                        <Typography sx={{ pl: 1, py: 1, pr: 2 }}>{`${valueIndex+1}`}</Typography>
                                        <TextField
                                            value={valueItem.key}
                                            sx={{ pr: 2, width: '40%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('key') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeHttpRequestItem(id, valueItem, index, "inputs", "key", e.target.value as string, "valueParams")
                                            }}
                                        />
                                        <TextField
                                            value={valueItem.description}
                                            sx={{ pr: 2, width: '60%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('Description') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeHttpRequestItem(id, valueItem, index, "inputs", "description", e.target.value as string, "valueParams")
                                            }}
                                        />
                                        <Box position={'absolute'} right={'2px'}>
                                            <Handle
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderWidth: '3.5px',
                                                    backgroundColor: 'white',
                                                    top: '0px',
                                                    right: '84px',
                                                    borderColor: '#21ba45'
                                                }}
                                                type="source"
                                                id={`${valueItem.key}_Right`}
                                                position={Position.Right}
                                            />
                                        </Box>
                                    </Grid>
                                )
                            })}


                            <Grid item sx={{pt: 7, pb: 1}} xs={12}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t("Http Body") as string}</Typography>
                              </Box>
                            </Grid>
                            <Grid item sx={{pt: 7, pb: 1}} xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={item.valueBody}
                                    sx={{ pr: 2, width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                    placeholder={t('key') as string}
                                    onChange={(e: any)=>{
                                        handleEditNodeHttpRequestItem(id, [], index, "inputs", "", e.target.value as string, "valueBody")
                                    }}
                                />
                            </Grid>


                            <Grid item sx={{pt: 7, pb: 1}} xs={8}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t("Http Header") as string}</Typography>
                              </Box>
                            </Grid>
                            <Grid item sx={{pt: 7, pb: 1}} xs={4}>
                              <Box display="flex" mb={1} alignItems="center">
                                <Button variant='contained' sx={{mt: 1}} size="small" startIcon={<Icon icon='mdi:add' />} onClick={()=>{
                                    handleNewNodeHttpRequestItem(id, index, "inputs", "valueHeader")
                                }}>
                                    {t('Add header')}
                                </Button>
                              </Box>
                            </Grid>
                            {item.valueHeader && item.valueHeader.length && item.valueHeader.map((valueItem: any, valueIndex: number)=>{

                                return (
                                    <Grid key={valueIndex} item sx={{ display: 'flex', alignItems: 'center', pt: 0, pl: 1 }} xs={12}>
                                        <Fab color='primary' aria-label='delete' size='small' sx={{width:'46px'}} onClick={()=>{
                                            handleDeleteNodeHttpRequestItem(id, valueItem, index, "inputs", "valueHeader")
                                        }}>
                                            <Icon icon='mdi:delete' />
                                        </Fab>
                                        <Typography sx={{ pl: 1, py: 1, pr: 2 }}>{`${valueIndex+1}`}</Typography>
                                        <TextField
                                            value={valueItem.key}
                                            sx={{ pr: 2, width: '40%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('key') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeHttpRequestItem(id, valueItem, index, "inputs", "key", e.target.value as string, "valueHeader")
                                            }}
                                        />
                                        <TextField
                                            value={valueItem.description}
                                            sx={{ pr: 2, width: '60%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            placeholder={t('Description') as string}
                                            onChange={(e: any)=>{
                                                handleEditNodeHttpRequestItem(id, valueItem, index, "inputs", "description", e.target.value as string, "valueHeader")
                                            }}
                                        />
                                        <Box position={'absolute'} right={'2px'}>
                                            <Handle
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderWidth: '3.5px',
                                                    backgroundColor: 'white',
                                                    top: '0px',
                                                    right: '84px',
                                                    borderColor: '#21ba45'
                                                }}
                                                type="source"
                                                id={`${valueItem.key}_Right`}
                                                position={Position.Right}
                                            />
                                        </Box>
                                    </Grid>
                                )
                            })}
                            
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
                                  <Switch 
                                        checked={!!item.value} 
                                        onChange={(e: any) => {
                                            setNodes((prevState: any)=>{
                                                const nodesNew = prevState.map((itemNode: any)=>{
                                                  if(itemNode.data.id == data.id) {
                                                    const targetNode = { ...itemNode }
                                                    const ItemData = targetNode.data.inputs[index]
                                                    targetNode.data.inputs[index] = { ...ItemData, value: !!e.target.checked }
                                                    console.log("targetNode", targetNode)
                                                    return targetNode
                                                  }
                                                  else {
                                                    return itemNode
                                                  }
                                                })
                                                return nodesNew;
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
                                        if(e.target.value != null) {
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
                                    if(e.target.value != null) {
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

            {OutputShow ? 
            <Fragment>
              <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
              <Grid item xs={12} sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {t("Outputs")}
                  </Typography>
              </Grid>
              <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
            </Fragment>
            :
            null}

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
                                    backgroundColor: 'white',
                                    top: '-22px',
                                    right: '87px',
                                    borderColor: '#36ADEF'
                                  }}
                                  type="source"
                                  id={`${item.key}_Right`}
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

          <Dialog maxWidth='xs' fullWidth open={RenameOpen} onClose={() => {
                                                                    setRenameOpen(false)
                                                                  }}>
            <DialogTitle>
            <Box display="flex" alignItems="center">
              <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
              <Typography sx={{pl: 2, pt: 2, pb: 1}}>{t('Custom Title') as string}</Typography>
              <Box position={'absolute'} right={'5px'} top={'1px'}>
                <IconButton size="small" edge="end" onClick={() => { setRenameOpen(false) } } aria-label="close">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            </DialogTitle>
            <DialogContent sx={{  }}>
              <Grid item xs={12}>
                  <TextField
                    defaultValue={NodeTitle}
                    sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    placeholder={t(NodeTitle) as string}
                    onChange={(e: any) => { setNodeTitle(e.target.value) }}
                  />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button size="small" variant='outlined' onClick={() => { setRenameOpen(false) } }>
                {t("Close")}
              </Button>
              <Button size="small" variant='outlined' onClick={()=>handleRenameNode(id)}>
                {t("Confirm")}
              </Button>
            </DialogActions>
          </Dialog>

          {isOpen ? 
            <Grid container direction="column" spacing={2} sx={{ width: '100px' }}>
              <Grid item sx={{ml: 2, mt: 0, width: '100px'}}>
                <Button size="small" variant='outlined' startIcon={<Icon icon='mdi:rename-box-outline' />} onClick={() => { setRenameOpen(true) } }>
                  {t('Rename')}
                </Button>
              </Grid>
              <Grid item sx={{ml: 2, mt: 0, width: '100px'}}>
                <Button size="small" variant='outlined' startIcon={<Icon icon='mdi:pencil-outline' />} onClick={()=>handleCopyNode(id)}>
                  {t('Copy')}
                </Button>
              </Grid>
              <Grid item sx={{ml: 2, mt: 0, width: '100px'}}>
                <Button size="small" variant='outlined' startIcon={<Icon icon='mdi:delete-outline' />} onClick={()=>handleDeleteNode(id)}>
                  {t('Delete')}
                </Button>
              </Grid>
            </Grid>
          :
          <Grid container direction="column" spacing={2} sx={{ width: '100px' }}>
            <Grid item sx={{ml: 2, mt: 0, width: '100px'}}>
            </Grid>
          </Grid>
          }
        </Grid>
  );
};


export default React.memo(NodeContentExtract);
