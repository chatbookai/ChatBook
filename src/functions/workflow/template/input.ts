import type { FlowNodeInputItemType } from 'src/functions/workflow/type.d';
import { DYNAMIC_INPUT_KEY, ModuleInputKeyEnum } from 'src/functions/workflow/constants';
import { FlowNodeInputTypeEnum } from 'src/functions/workflow/constants';
import { ModuleIOValueTypeEnum } from 'src/functions/workflow/constants';
import { chatNodeSystemPromptTip } from './tip';

export const Input_Template_Switch: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.switch,
  type: FlowNodeInputTypeEnum.hidden,
  label: '',
  description: 'Trigger',
  valueType: ModuleIOValueTypeEnum.any,
  showTargetInApp: true,
  showTargetInPlugin: true
};

export const Input_Template_History: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.history,
  type: FlowNodeInputTypeEnum.numberInput,
  label: 'chat history',
  required: true,
  min: 0,
  max: 30,
  valueType: ModuleIOValueTypeEnum.chatHistory,
  value: 6,
  showTargetInApp: true,
  showTargetInPlugin: true
};

export const Input_Template_UserChatInput: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.userChatInput,
  type: FlowNodeInputTypeEnum.custom,
  label: '',
  required: true,
  valueType: ModuleIOValueTypeEnum.string,
  showTargetInApp: true,
  showTargetInPlugin: true
};

export const Input_Template_AddInputParam: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.addInputParam,
  type: FlowNodeInputTypeEnum.addInputParam,
  valueType: ModuleIOValueTypeEnum.any,
  label: '',
  required: false,
  showTargetInApp: false,
  showTargetInPlugin: false
};

export const Input_Template_DynamicInput: FlowNodeInputItemType = {
  key: DYNAMIC_INPUT_KEY,
  type: FlowNodeInputTypeEnum.target,
  valueType: ModuleIOValueTypeEnum.any,
  label: 'dynamicTargetInput',
  description: 'dynamic input',
  required: false,
  showTargetInApp: false,
  showTargetInPlugin: true,
  hideInApp: true
};

export const Input_Template_SelectAIModel: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.aiModel,
  type: FlowNodeInputTypeEnum.selectLLMModel,
  label: 'aiModel',
  required: true,
  valueType: ModuleIOValueTypeEnum.string,
  showTargetInApp: false,
  showTargetInPlugin: false
};
export const Input_Template_SettingAiModel: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.aiModel,
  type: FlowNodeInputTypeEnum.settingLLMModel,
  label: 'aiModel',
  required: true,
  valueType: ModuleIOValueTypeEnum.string,
  showTargetInApp: false,
  showTargetInPlugin: false
};

export const Input_Template_System_Prompt: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.aiSystemPrompt,
  type: FlowNodeInputTypeEnum.textarea,
  max: 3000,
  valueType: ModuleIOValueTypeEnum.string,
  label: 'Prompt',
  description: chatNodeSystemPromptTip,
  placeholder: chatNodeSystemPromptTip,
  showTargetInApp: true,
  showTargetInPlugin: true
};

export const Input_Template_Dataset_Quote: FlowNodeInputItemType = {
  key: ModuleInputKeyEnum.aiChatDatasetQuote,
  type: FlowNodeInputTypeEnum.settingDatasetQuotePrompt,
  label: 'KnowledgeBaseRef',
  description: 'Input description',
  valueType: ModuleIOValueTypeEnum.datasetQuote,
  showTargetInApp: true,
  showTargetInPlugin: true
};
