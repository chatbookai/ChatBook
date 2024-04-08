import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from 'src/functions/workflow/constants';
import { FlowNodeTemplateType } from 'src/functions/workflow/type.d';
import {
  ModuleIOValueTypeEnum,
  ModuleInputKeyEnum,
  ModuleOutputKeyEnum,
  FlowNodeTemplateTypeEnum
} from 'src/functions/workflow/constants';

export const UserInputModule: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.questionInput,
  templateType: FlowNodeTemplateTypeEnum.systemInput,
  flowType: FlowNodeTypeEnum.questionInput,
  avatar: '/imgs/module/userChatInput.svg',
  name: '对话入口',
  intro: '当用户发送一个内容后，流程将会从这个模块开始执行。',
  inputs: [
    {
      key: ModuleInputKeyEnum.userChatInput,
      type: FlowNodeInputTypeEnum.systemInput,
      valueType: ModuleIOValueTypeEnum.string,
      label: 'user question',
      showTargetInApp: false,
      showTargetInPlugin: false
    }
  ],
  outputs: [
    {
      key: ModuleOutputKeyEnum.userChatInput,
      label: 'user question',
      type: FlowNodeOutputTypeEnum.source,
      valueType: ModuleIOValueTypeEnum.string,
      targets: []
    }
  ]
};
