import { FlowNodeInputItemType } from 'src/functions/core/module/node/type';
import { FlowNodeInputTypeEnum } from 'src/functions/core/module/node/constant';

export const defaultEditFormData: FlowNodeInputItemType = {
  valueType: 'string',
  type: FlowNodeInputTypeEnum.hidden,
  key: '',
  label: '',
  toolDescription: '',
  required: true
};
