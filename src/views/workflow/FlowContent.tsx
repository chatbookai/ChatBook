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
import { workflowData } from './workflowData'
import type { FlowModuleItemType } from 'src/functions/workflow/type';
import { getNanoid } from 'src/functions/workflow/string.tools';

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

const FlowContent = () => {
  const { t } = useTranslation();

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowModuleItemType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any[]>([]);
  
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  const customOnConnect = (connect: Connection) => {
    if (!connect.sourceHandle || !connect.targetHandle) {
      return;
    }
    console.log("customOnConnect", connect)
    if (connect.source === connect.target)      {
      // can not connect
      toast.error(t('Can not connect self') as string, {
        duration: 2000
      })
    }
    else {
      // allow connect
      console.log("edgesedges", edges, connect)
      const newEdge: any = {
        ...connect,
        id: getNanoid(6),
        type: 'buttonedge',
        style: { stroke: '#00ff00', strokeWidth: 2 }
      }
      console.log("edgesedges", newEdge)
      onConnect(newEdge);
    }
  }
  
  useEffect(()=>{
    const modules: Node<FlowModuleItemType, string | undefined>[] = workflowData.modules
    const edges: Edge<any[]>[] = workflowData.edges
    setEdges(edges)
    setNodes(modules)
    console.log("nodes edges", edges)
    console.log("nodes nodes", modules)
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
