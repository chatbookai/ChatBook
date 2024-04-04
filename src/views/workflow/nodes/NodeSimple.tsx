import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

const style = {
  padding: 10,
  border: '1px solid #ddd',
};

const NodeSimple = ({ data }: NodeProps) => {
  return (
    <div style={style}>
      <Handle type="source" position={Position.Left} id="left" />
      {data?.label}111111
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
};

export default memo(NodeSimple);
