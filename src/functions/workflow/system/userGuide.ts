import { FlowNodeInputTypeEnum } from 'src/functions/workflow/constants';
import { FlowNodeTemplateType } from 'src/functions/workflow/type.d';
import { ModuleIOValueTypeEnum, ModuleInputKeyEnum, FlowNodeTemplateTypeEnum } from 'src/functions/workflow/constants';


export enum FlowNodeTypeEnum {
  userGuide = 'userGuide',
  questionInput = 'questionInput',
  historyNode = 'historyNode',
  chatNode = 'chatNode',

  datasetSearchNode = 'datasetSearchNode',
  datasetConcatNode = 'datasetConcatNode',

  answerNode = 'answerNode',
  classifyQuestion = 'classifyQuestion',
  contentExtract = 'contentExtract',
  httpRequest = 'httpRequest',
  httpRequest468 = 'httpRequest468',
  runApp = 'app',
  pluginModule = 'pluginModule',
  pluginInput = 'pluginInput',
  pluginOutput = 'pluginOutput',
  queryExtension = 'cfr',
  tools = 'tools',
  stopTool = 'stopTool'
}

export const UserGuideModule: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.userGuide,
  templateType: FlowNodeTemplateTypeEnum.userGuide,
  flowType: FlowNodeTypeEnum.userGuide,
  avatar: '/imgs/module/userGuide.png',
  name: '全局配置',
  intro: 'userGuideTip',
  inputs: [
    {
      key: ModuleInputKeyEnum.welcomeText,
      type: FlowNodeInputTypeEnum.hidden,
      valueType: ModuleIOValueTypeEnum.string,
      label: 'core.app.Welcome Text',
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.variables,
      type: FlowNodeInputTypeEnum.hidden,
      valueType: ModuleIOValueTypeEnum.any,
      label: 'core.module.Variable',
      value: [],
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.questionGuide,
      valueType: ModuleIOValueTypeEnum.boolean,
      type: FlowNodeInputTypeEnum.switch,
      label: '',
      showTargetInApp: false,
      showTargetInPlugin: false
    },
    {
      key: ModuleInputKeyEnum.tts,
      type: FlowNodeInputTypeEnum.hidden,
      valueType: ModuleIOValueTypeEnum.any,
      label: '',
      showTargetInApp: false,
      showTargetInPlugin: false
    }
  ],
  outputs: []
};
