import React, { memo, ReactNode } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

export default memo(({ data }: NodeProps<TurboNodeData>) => {
  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body">
            <div>
              <div className="title">{data.title}</div>
            </div>
          </div>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    </>
  );
});
