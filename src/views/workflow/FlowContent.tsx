import React, { useCallback } from 'react';
import ReactFlow, { Controls, addEdge, ReactFlowProvider, Background} from 'reactflow';

import 'reactflow/dist/base.css';
import TurboNode from './TurboNode';
import TurboEdge from './TurboEdge';

const nodeTypes = {
  turbo: TurboNode,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

const Flow = (props: any) => {
  // ** Props
  const {
    nodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange
  } = props

  const onConnect = useCallback((params: any) => setEdges((els: any) => addEdge(params, els)), []);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default Flow;
