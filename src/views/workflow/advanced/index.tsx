import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Node,
  Edge,
  ConnectionMode,
  Connection,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from 'reactflow';
import 'reactflow/dist/style.css';

import { FlowContext } from './FlowContext';
import FlowLeft from './FlowLeft';
import ButtonEdge from '../edges/ButtonEdge';
import SelfConnectingEdge from '../edges/SelfConnectingEdge';
import BiDirectionalEdge from '../edges/BiDirectionalEdge';

import NodeSimple from 'src/views/workflow/nodes/NodeSimple';
import NodeQuestionInput from 'src/views/workflow/nodes/NodeQuestionInput';
import NodeUserGuide from 'src/views/workflow/nodes/NodeUserGuide';
import NodeChatNode from 'src/views/workflow/nodes/NodeChatNode';
import NodeAssignedReply from 'src/views/workflow/nodes/NodeAssignedReply';
import NodeClassifyQuestion from 'src/views/workflow/nodes/NodeClassifyQuestion';
import NodeContentExtract from 'src/views/workflow/nodes/NodeContentExtract';
import NodeHttpRequest from 'src/views/workflow/nodes/NodeHttpRequest';

import { allNodesData } from '../data/allNodesData';
import { simpleChat } from '../data/simpleChat';
import type { FlowModuleItemType } from 'src/functions/workflow/type';
import { getNanoid } from 'src/functions/workflow/string.tools';
import { generateRandomNumber, downloadJson } from 'src/functions/ChatBook';

import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next';

import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'

import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'

const edgeTypes = {
  bidirectional: BiDirectionalEdge,
  selfconnecting: SelfConnectingEdge,
  buttonedge: ButtonEdge,
};

const nodeTypes = {
  nodeSimple: NodeSimple,
  questionInput: NodeQuestionInput,
  userGuide: NodeUserGuide,
  chatNode: NodeChatNode,
  historyNode: NodeSimple,
  datasetSearchNode: NodeSimple,
  runApp: NodeSimple,
  pluginModule: NodeSimple,
  queryExtension: NodeSimple,
  assignedReply: NodeAssignedReply,
  classifyQuestion: NodeClassifyQuestion,
  contentExtract: NodeContentExtract,
  httpRequest: NodeHttpRequest
};

const AdvancedWorkflow = () => {
  const { t } = useTranslation();
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()

  const [LeftOpen, setLeftOpen] = useState<boolean>(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowModuleItemType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any[]>([]);
  const [currentWorkflowData, setCurrentWorkflowData] = useState<any>();

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  const customOnConnect = (connect: Connection) =>        {
    if (!connect.sourceHandle || !connect.targetHandle) {

      return;
    }
    if (connect.source === connect.target)      {

      // can not connect
      toast.error(t('Can not connect self') as string, {
        duration: 2000
      })
    }
    else {

      // allow connect
      //console.log("edgesedges", edges, connect)
      const newEdge: any = {
        ...connect,
        id: getNanoid(6),
        type: 'buttonedge',
        style: { stroke: '#00BFFF', strokeWidth: 4 }
      }
      onConnect(newEdge);
    }
  }

  const handleAddNode = (flowType: string) => {
    const allNodesDataList = allNodesData.modules;
    const getNanoidValue = getNanoid(6);
    const currentNodes = nodes.map((node: any) => {

      return {
        ...node,
        selected: false
      };
    });
    const addNode = allNodesDataList.filter((node: any) => {

      return node.type == flowType
    });
    const addNodeFilter = addNode.map((node: any) => {
      const X = generateRandomNumber(90,100)
      const Y = generateRandomNumber(50,60)
      if (node.type == flowType) {

        return {
          ...node,
          data: {
            ...node.data,
            id: getNanoidValue
          },
          position: {
            x: node.position.x + X,
            y: node.position.y + Y,
          },
          positionAbsolute: {
            x: node.position.x + X,
            y: node.position.y + Y,
          },
          id: getNanoidValue,
          selected: true
        };
      }
      else {

        return node;
      }
    });
    const updatedNodes = currentNodes.concat(addNodeFilter);
    setNodes(updatedNodes);
    setLeftOpen(false);

    //console.log("handleCopyNode", nodeId, copyNodes, currentNode1)
    //console.log("handleCopyNode updatedNodes", updatedNodes)
  };

  const onNodesDelete = useCallback(
    (deleted: any) => {
      setEdges(
        deleted.reduce((acc: any, node: any) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge: any) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const onEdgeClick = (event: any, edge: any) => {
    const updateEdges: Edge<any[]>[] = edges.map((item: any)=>{
      if(item.id == edge.id) {

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
    setEdges(updateEdges)
  };

  const onSelectionChange = (elements: any) => {
    console.log('onSelectionChange changed:', elements);
  };

  const handleExportWorkFlow = () => {
    const simpleWorkflowData = {
      ...simpleChat,
      modules: nodes,
      edges: edges
    }
    downloadJson(simpleWorkflowData, simpleWorkflowData.name + "[" + simpleWorkflowData.updateTime.replaceAll(":","") + "]")
    toast.success(t('Export Ai Workflow success') as string, {
      duration: 2000
    })
    console.log('handleExportData:', simpleWorkflowData);
  };

  const handleTestWorkFlow = () => {
    const simpleWorkflowData = {
      ...simpleChat,
      modules: nodes,
      edges: edges
    }
    console.log('handleTestWorkFlow:', simpleWorkflowData);
  };

  const handleSaveWorkFlow = async () => {
    if (auth && auth.user) {
      const workflowNew = {
        ...currentWorkflowData,
        updateTime: String(new Date(Date.now()).toLocaleString()),
        mode: 'advanced',
        modules: nodes,
        edges: edges
      }
      const PostParams = {name: workflowNew.name, _id: workflowNew._id, teamId: workflowNew.teamId, intro: workflowNew.intro, avatar: workflowNew.avatar, type: workflowNew.type, flowGroup: workflowNew.flowGroup, permission: workflowNew.permission, data: workflowNew}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/editworkflow', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      toast.success(t('Save Ai Workflow success') as string, {
        duration: 2000
      })
    }
  }

  const fetchData = async function (id: string) {
    if (auth && auth.user && id) {
      const CurrentWorkflowDataTemp = await axios.get(authConfig.backEndApiChatBook + '/api/getworkflow/' + id, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      const nodesInitial: Node<FlowModuleItemType, string | undefined>[] = CurrentWorkflowDataTemp.modules
      const edgesInitial: Edge<any[]>[] = CurrentWorkflowDataTemp.edges
      setEdges(edgesInitial)
      setNodes(nodesInitial)
      setCurrentWorkflowData(CurrentWorkflowDataTemp)
    }
  }

  useEffect(() => {
    if(id) {
      fetchData(String(id))  
    }
  }, [id])

  useEffect(() => {
    console.log('Nodes changed:', nodes);
  }, [nodes]);

  return (
    <FlowContext.Provider value={{ setNodes, nodes, setEdges, edges }}>
      <ReactFlowProvider>
        <ReactFlow
          fitView
          nodes={nodes}
          edges={edges}
          minZoom={0.1}
          maxZoom={1.5}
          defaultEdgeOptions={{
            animated: true,
            zIndex: 0
          }}
          elevateEdgesOnSelect
          connectionLineStyle={{ strokeWidth: 2, stroke: '#5A646Es' }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onSelectionChange={onSelectionChange}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onEdgeClick={onEdgeClick}
          onEdgesChange={onEdgesChange}
          onConnect={customOnConnect}
          attributionPosition="bottom-right"
          connectionMode={ConnectionMode.Loose}
        >
          <Controls />
          <Background />
          <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2, pl: 2 }}>
            <Box sx={{mt: 1}}>
              <Fab color='primary' aria-label='add' size='small' onClick={() => { 
                setLeftOpen(true) 
                }}>
                <Icon icon='mdi:plus' />
              </Fab>
            </Box>
            <Box sx={{mt: 3}}>
              <Fab color='primary' aria-label='add' size='small' onClick={() => { 
                router.push(`/workflow/edit/${id}`)
                }}>
                <Icon icon='mdi:keyboard-return' />
              </Fab>
            </Box>
          </Box>
          <div style={{ position: 'absolute', top: '8px', right: '5px', zIndex: 999 }}>
            <Button variant='outlined' sx={{mr: 1}} size="small" startIcon={<Icon icon='mingcute:file-export-fill' />} onClick={()=>{
              handleExportWorkFlow()
            }}>
              {t("Export")}
            </Button>
            <Button variant='outlined' sx={{mr: 1}} size="small" startIcon={<Icon icon='material-symbols:chat' />} onClick={()=>{
              handleTestWorkFlow()
            }}>
              {t("Test")}
            </Button>
            <Button variant='contained' sx={{mr: 1}} size="small" startIcon={<Icon icon='material-symbols:save' />}onClick={()=>{
              handleSaveWorkFlow()
            }}>
              {t("Save")}
            </Button>
          </div>
          <FlowLeft LeftOpen={LeftOpen} setLeftOpen={setLeftOpen} handleAddNode={handleAddNode}/>
        </ReactFlow>
      </ReactFlowProvider>
    </FlowContext.Provider>
  );
};

export default AdvancedWorkflow;
