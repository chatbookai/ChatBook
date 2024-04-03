import React from 'react';
import { NodeProps } from 'reactflow';
import NodeCard from '../render/NodeCard';
import { FlowModuleItemType } from 'src/functions/core/module/type.d';

const NodeEmpty = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  return <NodeCard selected={selected} {...data}></NodeCard>;
};

export default React.memo(NodeEmpty);
