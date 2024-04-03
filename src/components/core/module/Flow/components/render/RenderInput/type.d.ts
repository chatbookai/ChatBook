import { FlowNodeInputItemType } from 'src/functions/core/module/node/type';

export type RenderInputProps = {
  inputs?: FlowNodeInputItemType[];
  item: FlowNodeInputItemType;
  moduleId: string;
};
