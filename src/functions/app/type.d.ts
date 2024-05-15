
export type AppSimpleEditFormType = {
  AiSettings: {
    model: string;
    systemPrompt?: string | undefined;
    temperature: number;
    maxToken: number;
    isResponseAnswerText: boolean;
    maxHistories: number;
  };
  dataset: {
    datasets: SelectedDatasetType;
    searchMode: `${DatasetSearchModeEnum}`;
    similarity?: number;
    limit?: number;
    usingReRank?: boolean;
    datasetSearchUsingExtensionQuery?: boolean;
    datasetSearchExtensionModel?: string;
    datasetSearchExtensionBg?: string;
  };
  selectedTools: FlowNodeTemplateType[];
  userGuide: {
    welcomeText: string;
    variables: {
      id: string;
      key: string;
      label: string;
      type: `${VariableInputEnum}`;
      required: boolean;
      maxLen: number;
      enums: {
        value: string;
      }[];
    }[];
    questionGuide: boolean;
    tts: {
      type: 'none' | 'web' | 'model';
      model?: string | undefined;
      voice?: string | undefined;
      speed?: number | undefined;
    };
  };
};

export type FlowNodeTemplateType = {
  id: string; // module id, unique
  templateType: `${FlowNodeTemplateTypeEnum}`;
  flowType: `${FlowNodeTypeEnum}`; // render node card
  avatar?: string;
  name: string;
  intro: string; // template list intro
  isTool?: boolean; // can be connected by tool
  showStatus?: boolean; // chatting response step status
  inputs: FlowNodeInputItemType[];
  outputs: FlowNodeOutputItemType[];

  // plugin data
  pluginType?: `${PluginTypeEnum}`;
  parentId?: string;
};
export type FlowModuleItemType = FlowNodeTemplateType & {
  moduleId: string;
};
export type moduleTemplateListType = {
  type: `${FlowNodeTemplateTypeEnum}`;
  label: string;
  list: FlowNodeTemplateType[];
}[];

// store module type
export type ModuleItemType = {
  name: string;
  avatar?: string;
  intro?: string;
  moduleId: string;
  position?: {
    x: number;
    y: number;
  };
  flowType: `${FlowNodeTypeEnum}`;
  showStatus?: boolean;
  inputs: FlowNodeInputItemType[];
  outputs: FlowNodeOutputItemType[];

  // runTime field
  isEntry?: boolean;
};

/* --------------- function type -------------------- */
// variable
export type VariableItemType = {
  id: string;
  key: string;
  label: string;
  type: `${VariableInputEnum}`;
  required: boolean;
  maxLen: number;
  enums: { value: string }[];
};

// tts
export type AppTTSConfigType = {
  type: 'none' | 'web' | 'model';
  model?: string;
  voice?: string;
  speed?: number;
};

export type SelectAppItemType = {
  id: string;
  name: string;
  logo: string;
};

/* agent */
export type ClassifyQuestionAgentItemType = {
  value: string;
  key: string;
};
export type ContextExtractAgentItemType = {
  desc: string;
  key: string;
  required: boolean;
  defaultValue?: string;
  enum?: string;
};

/* -------------- running module -------------- */
export type ChatDispatchProps = {
  res: NextApiResponse;
  mode: 'test' | 'chat';
  teamId: string;
  tmbId: string;
  user: UserModelSchema;
  appId: string;
  chatId?: string;
  responseChatItemId?: string;
  histories: ChatItemType[];
  variables: Record<string, any>;
  inputFiles?: UserChatItemValueItemType['file'][];
  stream: boolean;
  detail: boolean; // response detail
  maxRunTimes: number;
};

export type ModuleDispatchProps<T> = ChatDispatchProps & {
  module: any;
  runtimeModules: any[];
  params: T;
};


export type FlowNodeChangeProps = {
  moduleId: string;
  type:
    | 'attr' // key: attr, value: new value
    | 'updateInput' // key: update input key, value: new input value
    | 'replaceInput' // key: old input key, value: new input value
    | 'addInput' // key: null, value: new input value
    | 'delInput' // key: delete input key, value: null
    | 'updateOutput' // key: update output key, value: new output value
    | 'replaceOutput' // key: old output key, value: new output value
    | 'addOutput' // key: null, value: new output value
    | 'delOutput'; // key: delete output key, value: null
  key?: string;
  value?: any;
  index?: number;
};

export type FlowNodeInputItemType = {
  valueType?: `${ModuleIOValueTypeEnum}`; // data type
  type: `${FlowNodeInputTypeEnum}`; // Node Type. Decide on a render style
  key: `${ModuleInputKeyEnum}` | string;
  value?: any;
  label: string;
  description?: string;
  required?: boolean;
  toolDescription?: string; // If this field is not empty, it is entered as a tool

  edit?: boolean; // Whether to allow editing
  editField?: EditInputFieldMap;
  defaultEditField?: EditNodeFieldType;

  connected?: boolean; // There are incoming data

  showTargetInApp?: boolean;
  showTargetInPlugin?: boolean;

  hideInApp?: boolean;
  hideInPlugin?: boolean;

  placeholder?: string; // input,textarea

  list?: { label: string; value: any }[]; // select

  markList?: { label: string; value: any }[]; // slider
  step?: number; // slider
  max?: number; // slider, number input
  min?: number; // slider, number input

  llmModelType?: `${LLMModelTypeEnum}`;
};

export type FlowNodeOutputTargetItemType = {
  moduleId: string;
  key: string;
};
export type FlowNodeOutputItemType = {
  type?: `${FlowNodeOutputTypeEnum}`;
  key: `${ModuleOutputKeyEnum}` | string;
  valueType?: `${ModuleIOValueTypeEnum}`;

  label?: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;

  edit?: boolean;
  editField?: EditOutputFieldMap;
  defaultEditField?: EditNodeFieldType;

  targets: FlowNodeOutputTargetItemType[];
};

/* --------------- edit field ------------------- */
export type EditInputFieldMap = EditOutputFieldMap & {
  inputType?: boolean;
  required?: boolean;
  isToolInput?: boolean;
};
export type EditOutputFieldMap = {
  name?: boolean;
  key?: boolean;
  description?: boolean;
  dataType?: boolean;
  defaultValue?: boolean;
};
export type EditNodeFieldType = {
  inputType?: `${FlowNodeInputTypeEnum}`; // input type
  outputType?: `${FlowNodeOutputTypeEnum}`;
  required?: boolean;
  key?: string;
  label?: string;
  description?: string;
  valueType?: `${ModuleIOValueTypeEnum}`;
  isToolInput?: boolean;
  defaultValue?: string;
};

/* ------------- item type --------------- */
export type SettingAIDataType = {
  model: string;
  temperature: number;
  maxToken: number;
  isResponseAnswerText?: boolean;
  maxHistories?: number;
};

/* ai chat modules props */
export type AIChatModuleProps = {
  [ModuleInputKeyEnum.AiModel]: string;
  [ModuleInputKeyEnum.aiSystemPrompt]?: string;
  [ModuleInputKeyEnum.aiChatTemperature]: number;
  [ModuleInputKeyEnum.aiChatMaxToken]: number;
  [ModuleInputKeyEnum.aiChatIsResponseText]: boolean;
  [ModuleInputKeyEnum.aiChatQuoteTemplate]?: string;
  [ModuleInputKeyEnum.aiChatQuotePrompt]?: string;
};

export type DatasetModuleProps = {
  [ModuleInputKeyEnum.datasetSelectList]: SelectedDatasetType;
  [ModuleInputKeyEnum.datasetSimilarity]: number;
  [ModuleInputKeyEnum.datasetMaxTokens]: number;
  [ModuleInputKeyEnum.datasetStartReRank]: boolean;
};

export type UserModelSchema = {
  _id: string;
  username: string;
  email?: string;
  phonePrefix?: number;
  phone?: string;
  password: string;
  avatar: string;
  promotionRate: number;
  inviterId?: string;
  openaiKey: string;
  createTime: number;
  timezone: string;
  status: `${UserStatusEnum}`;
  lastLoginTmbId?: string;
  openaiAccount?: {
    key: string;
    baseUrl: string;
  };
};