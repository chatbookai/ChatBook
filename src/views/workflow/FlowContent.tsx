import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Position,
  ConnectionMode,
  Connection,
  MarkerType,
  NodeProps,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import ButtonEdge from './ButtonEdge';
import SelfConnectingEdge from './SelfConnectingEdge';
import BiDirectionalEdge from './BiDirectionalEdge';
import BiDirectionalNode from './BiDirectionalNode';

import NodeSimple from 'src/views/workflow/nodes/NodeSimple';
import NodeQuestionInput from 'src/views/workflow/nodes/NodeQuestionInput';
import NodeUserGuide from 'src/views/workflow/nodes/NodeUserGuide';
import NodeChatNode from 'src/views/workflow/nodes/NodeChatNode';
import { workflowData, initialNodes, initialEdges } from './workflowData'
import { appModule2FlowEdge, appModule2FlowNode } from 'src/functions/workflow/functions';

import { ModuleItemType } from 'src/functions/workflow/type';

import toast from 'react-hot-toast'

import { useTranslation } from 'next-i18next';

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
  httpRequest: NodeSimple,
  runApp: NodeSimple,
  pluginModule: NodeSimple,
  queryExtension: NodeSimple
};

const edgeTypes2 = {
};

const FlowContent = () => {
  const { t } = useTranslation();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  const customOnConnect = (connect: Connection) => {
    if (!connect.sourceHandle || !connect.targetHandle) {
      return;
    }
    console.log("customOnConnect", connect)
    if (connect.source === connect.target) {
      //return toast({
      //  status: 'warning',
      //  title: t('core.module.Can not connect self') as string
      //});
    }
    onConnect({
      ...connect,
      type: 'buttonedge',
      style: { stroke: '#00ff00', strokeWidth: 2 }
    });
  }
  
  useEffect(()=>{
    const modules: ModuleItemType[] = workflowData.modules
    //const edges = appModule2FlowEdge(modules)
    //setEdges(edges)
    const edges = [
      {
      id: "bmf6ry",
      source: "userChatInput",
      sourceHandle: "userChatInput",
      target: "chatModule",
      targetHandle: "NodeChatPrompt7_Left",
      type: "buttonedge",
      animated: true,
      style: { stroke: '#00ff00', strokeWidth: 2 }
      },
      {
        id: "bmf6r1",
        source: "userChatInput",
        sourceHandle: "userChatInput",
        target: "chatModule",
        targetHandle: "9_Left",
        type: "buttonedge",
        animated: true,
        style: { stroke: '#00ff00', strokeWidth: 2 }
      }
    ]
    console.log("nodes edges", edges)
    setEdges(edges)

    const nodes = modules.map((item: any) => appModule2FlowNode(item))
    setNodes(nodes)
    //console.log("nodes modules", workflowData.modules)
    console.log("nodes nodes", nodes)
  }, [])

  return (
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
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={customOnConnect}
      attributionPosition="bottom-right"
      connectionMode={ConnectionMode.Loose}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default FlowContent;
