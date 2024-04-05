import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from 'src/functions/workflow/constants';
import { FlowNodeTemplateType } from 'src/functions/workflow/type.d';
import {
  ModuleIOValueTypeEnum,
  ModuleInputKeyEnum,
  FlowNodeTemplateTypeEnum
} from 'src/functions/workflow/constants';
import {
  Input_Template_SelectAIModel,
  Input_Template_History,
  Input_Template_Switch,
  Input_Template_UserChatInput
} from 'src/functions/workflow/template/input';
import { Output_Template_UserChatInput } from 'src/functions/workflow/template/output';
import { Input_Template_System_Prompt } from 'src/functions/workflow/template/input';
import { LLMModelTypeEnum } from 'src/functions/workflow/constants';

export const ClassifyQuestionModule: FlowNodeTemplateType = {
  id: FlowNodeTypeEnum.classifyQuestion,
  templateType: FlowNodeTemplateTypeEnum.functionCall,
  flowType: FlowNodeTypeEnum.classifyQuestion,
  avatar: '/imgs/module/cq.png',
  name: '问题分类',
  intro: `根据用户的历史记录和当前问题判断该次提问的类型。可以添加多组问题类型，下面是一个模板例子：\n类型1: 打招呼\n类型2: 关于商品“使用”问题\n类型3: 关于商品“购买”问题\n类型4: 其他问题`,
  showStatus: true,
  inputs: [
    Input_Template_Switch,
    {
      ...Input_Template_SelectAIModel,
      llmModelType: LLMModelTypeEnum.classify
    },
    {
      ...Input_Template_System_Prompt,
      label: 'core.module.input.label.Background',
      description: 'core.module.input.description.Background',
      placeholder: 'core.module.input.placeholder.Classify background'
    },
    Input_Template_History,
    Input_Template_UserChatInput,
    {
      key: ModuleInputKeyEnum.agents,
      type: FlowNodeInputTypeEnum.custom,
      valueType: ModuleIOValueTypeEnum.any,
      label: '',
      value: [
        {
          value: '打招呼',
          key: 'wqre'
        },
        {
          value: '关于 xxx 的问题',
          key: 'sdfa'
        },
        {
          value: '其他问题',
          key: 'agex'
        }
      ],
      showTargetInApp: false,
      showTargetInPlugin: false
    }
  ],
  outputs: [
    Output_Template_UserChatInput,
    // custom output
    {
      key: 'wqre',
      label: '',
      type: FlowNodeOutputTypeEnum.hidden,
      targets: []
    },
    {
      key: 'sdfa',
      label: '',
      type: FlowNodeOutputTypeEnum.hidden,
      targets: []
    },
    {
      key: 'agex',
      label: '',
      type: FlowNodeOutputTypeEnum.hidden,
      targets: []
    }
  ]
};
