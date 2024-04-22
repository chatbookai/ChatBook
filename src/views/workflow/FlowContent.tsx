import React, { useCallback, useEffect, useState } from 'react';
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
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from 'reactflow';
import 'reactflow/dist/style.css';

import { FlowContext } from './FlowContext';
import FlowLeft from './FlowLeft';
import ButtonEdge from './edges/ButtonEdge';
import SelfConnectingEdge from './edges/SelfConnectingEdge';
import BiDirectionalEdge from './edges/BiDirectionalEdge';
import BiDirectionalNode from './edges/BiDirectionalNode';

import NodeSimple from 'src/views/workflow/nodes/NodeSimple';
import NodeQuestionInput from 'src/views/workflow/nodes/NodeQuestionInput';
import NodeUserGuide from 'src/views/workflow/nodes/NodeUserGuide';
import NodeChatNode from 'src/views/workflow/nodes/NodeChatNode';
import NodeAssignedReply from 'src/views/workflow/nodes/NodeAssignedReply';

import { workflowData } from './data/workflowData'
import type { FlowModuleItemType } from 'src/functions/workflow/type';
import { getNanoid } from 'src/functions/workflow/string.tools';

import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next';

import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'


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
  queryExtension: NodeSimple,
  assignedReply: NodeAssignedReply
};

const FlowContent = () => {
  const { t } = useTranslation();

  const [LeftOpen, setLeftOpen] = useState<boolean>(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowModuleItemType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any[]>([]);
  
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  const customOnConnect = (connect: Connection) => {
    if (!connect.sourceHandle || !connect.targetHandle) {
      return;
    }
    //console.log("customOnConnect", connect)
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
      //console.log("edgesedges", newEdge)
      onConnect(newEdge);
    }
  }

  const handleAddNode = (flowType: string) => {
    const getNanoidValue = getNanoid(6);
    const copyNodes = nodes.map((node: any) => {
      return {
        ...node,
        selected: false
      };
    });
    const currentNode1 = copyNodes.filter((node: any) => {
      return node.type == flowType
    });
    const currentNode2 = currentNode1.map((node: any) => {
      if (node.type == flowType) {
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
    //console.log('onEdgeClick onDeleteClick', event);
  };

  const onSelectionChange = (elements: any) => {
    //console.log('Selection changed:', elements);
  };
  
  useEffect(()=>{
    const modules: Node<FlowModuleItemType, string | undefined>[] = workflowData.modules
    const edgesInitial: Edge<any[]>[] = workflowData.edges
    setEdges(edgesInitial)
    setNodes(modules)
    //console.log("nodes edges", edgesInitial)
    //console.log("nodes nodes", modules)
  }, [])

  useEffect(()=>{
    //console.log("nodes edges useEffect", edges)
    //console.log("nodes nodes useEffect", nodes)
  }, [edges])

  useEffect(() => {
    //console.log('Nodes changed:', nodes);
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
          <Box sx={{pt: 2, pl: 2}}>
            <Fab color='primary' aria-label='add' size='small' onClick={()=>{setLeftOpen(true)}}>
              <Icon icon='mdi:plus' />
            </Fab>
          </Box>
          <FlowLeft LeftOpen={LeftOpen} setLeftOpen={setLeftOpen} handleAddNode={handleAddNode}/>
        </ReactFlow>
      </ReactFlowProvider>
    </FlowContext.Provider>
  );
};

export default FlowContent;
