import React, { useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { FlowContext } from '../advanced/FlowContext'

import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from 'reactflow';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    style = {},
    markerEnd,
    source,
    target
  }: EdgeProps) {
    
    const { nodes } = useContext(FlowContext);

    const active = (() => {
      const connectNode = nodes.find((node: any) => {
        
        return (node.id === source || node.id === target) && node.selected;
      });

      return !!(connectNode || selected);
    })();
    
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const onDeleteClick = (event: any) => {
      event.stopPropagation()
      console.log("onDeleteClick", onDeleteClick, "active", active)
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
      <>
        <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,

              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: 'all',
              zIndex: 999
            }}
          >
            <IconButton onClick={onDeleteClick} color='primary'>
              <Icon icon='fa:remove' fontSize={25} />
            </IconButton>
          </div>
        </EdgeLabelRenderer>
      </>
    );
}
