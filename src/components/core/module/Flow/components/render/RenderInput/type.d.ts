import { FlowNodeInputItemType } from 'src/functions/temp/core/module/node/type';

export type RenderInputProps = {
  inputs?: FlowNodeInputItemType[];
  item: FlowNodeInputItemType;
  moduleId: string;
};
