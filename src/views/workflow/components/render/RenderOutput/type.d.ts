import { FlowNodeOutputItemType } from 'src/functions/core/module/node/type';

export type RenderOutputProps = {
  outputs?: FlowNodeOutputItemType[];
  item: FlowNodeOutputItemType;
  moduleId: string;
};
