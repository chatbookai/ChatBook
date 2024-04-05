import { FlowNodeInputItemType } from 'src/functions/temp/core/module/node/type';
import { FlowNodeInputTypeEnum } from 'src/functions/temp/core/module/node/constant';

export const defaultEditFormData: FlowNodeInputItemType = {
  valueType: 'string',
  type: FlowNodeInputTypeEnum.hidden,
  key: '',
  label: '',
  toolDescription: '',
  required: true
};
