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
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ButtonEdge from './ButtonEdge';
import SelfConnectingEdge from './SelfConnectingEdge';
import BiDirectionalEdge from './BiDirectionalEdge';
import BiDirectionalNode from './BiDirectionalNode';
import { workflowData, initialNodes, initialEdges } from './workflowData'
import { appModule2FlowEdge, appModule2FlowNode } from 'src/functions/utils/adapt';
import { ModuleItemType } from 'src/functions/core/module/type.d';

const edgeTypes = {
  bidirectional: BiDirectionalEdge,
  selfconnecting: SelfConnectingEdge,
  buttonedge: ButtonEdge,
};

const nodeTypes = {
  bidirectional: BiDirectionalNode,
};

const EdgesFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);
 
  useEffect(()=>{
    const modules: ModuleItemType[] = workflowData.modules
    const edges = appModule2FlowEdge({modules})
    setEdges(edges)
    const nodes = modules.map((item: any) => appModule2FlowNode({ item }))
    setNodes(nodes)
    console.log("workflowData", workflowData.modules)
    console.log("edges", edges)
    console.log("nodes", nodes)
  }, [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      snapToGrid={true}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="top-right"
      connectionMode={ConnectionMode.Loose}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default EdgesFlow;
