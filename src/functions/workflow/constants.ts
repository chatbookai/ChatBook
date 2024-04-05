import type { moduleTemplateListType } from 'src/functions/workflow/type.d';

export enum FlowNodeTemplateTypeEnum {
  userGuide = 'userGuide',
  systemInput = 'systemInput',
  tools = 'tools',
  textAnswer = 'textAnswer',
  functionCall = 'functionCall',
  externalCall = 'externalCall',

  personalPlugin = 'personalPlugin',

  other = 'other'
}

export const moduleTemplatesList: moduleTemplateListType = [
  {
    type: FlowNodeTemplateTypeEnum.userGuide,
    label: '',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.textAnswer,
    label: 'core.module.template.Response module',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.functionCall,
    label: 'core.module.template.Function module',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.tools,
    label: 'core.module.template.Tool module',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.externalCall,
    label: 'core.module.template.External module',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.personalPlugin,
    label: '',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.other,
    label: '其他',
    list: []
  },
  {
    type: FlowNodeTemplateTypeEnum.systemInput,
    label: 'core.module.template.System input module',
    list: []
  }
];

  export enum FlowNodeInputTypeEnum {
    triggerAndFinish = 'triggerAndFinish',
    systemInput = 'systemInput', // history, userChatInput, variableInput
  
    input = 'input', // one line input
    numberInput = 'numberInput',
    select = 'select',
    slider = 'slider',
    target = 'target', // data input
    switch = 'switch',
  
    // editor
    textarea = 'textarea',
    JSONEditor = 'JSONEditor',
  
    addInputParam = 'addInputParam', // params input
  
    selectApp = 'selectApp',
  
    // chat special input
    aiSettings = 'aiSettings',
  
    // ai model select
    selectLLMModel = 'selectLLMModel',
    settingLLMModel = 'settingLLMModel',
  
    // dataset special input
    selectDataset = 'selectDataset',
    selectDatasetParamsModal = 'selectDatasetParamsModal',
    settingDatasetQuotePrompt = 'settingDatasetQuotePrompt',
  
    hidden = 'hidden',
    custom = 'custom'
  }
  
  export enum FlowNodeOutputTypeEnum {
    answer = 'answer',
    source = 'source',
    hidden = 'hidden',
  
    addOutputParam = 'addOutputParam'
  }
  
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
  
  export const EDGE_TYPE = 'default';
  


export enum ModuleIOValueTypeEnum {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  chatHistory = 'chatHistory',
  datasetQuote = 'datasetQuote',
  any = 'any',

  // plugin special type
  selectApp = 'selectApp',
  selectDataset = 'selectDataset',

  // tool
  tools = 'tools'
}

/* reg: modulename key */
export enum ModuleInputKeyEnum {
  // old
  welcomeText = 'welcomeText',
  variables = 'variables',
  switch = 'switch', // a trigger switch
  history = 'history',
  userChatInput = 'userChatInput',
  questionGuide = 'questionGuide',
  tts = 'tts',
  answerText = 'text',
  agents = 'agents', // cq agent key

  // latest
  // common
  aiModel = 'model',
  aiSystemPrompt = 'systemPrompt',
  description = 'description',
  anyInput = 'system_anyInput',
  textareaInput = 'system_textareaInput',
  addInputParam = 'system_addInputParam',

  // history
  historyMaxAmount = 'maxContext',

  // ai chat
  aiChatTemperature = 'temperature',
  aiChatMaxToken = 'maxToken',
  aiChatSettingModal = 'aiSettings',
  aiChatIsResponseText = 'isResponseAnswerText',
  aiChatQuoteTemplate = 'quoteTemplate',
  aiChatQuotePrompt = 'quotePrompt',
  aiChatDatasetQuote = 'quoteQA',

  // dataset
  datasetSelectList = 'datasets',
  datasetSimilarity = 'similarity',
  datasetMaxTokens = 'limit',
  datasetSearchMode = 'searchMode',
  datasetSearchUsingReRank = 'usingReRank',
  datasetSearchUsingExtensionQuery = 'datasetSearchUsingExtensionQuery',
  datasetSearchExtensionModel = 'datasetSearchExtensionModel',
  datasetSearchExtensionBg = 'datasetSearchExtensionBg',

  // context extract
  contextExtractInput = 'content',
  extractKeys = 'extractKeys',

  // http
  httpReqUrl = 'system_httpReqUrl',
  httpHeaders = 'system_httpHeader',
  httpMethod = 'system_httpMethod',
  httpParams = 'system_httpParams',
  httpJsonBody = 'system_httpJsonBody',
  abandon_httpUrl = 'url',

  // app
  runAppSelectApp = 'app',

  // plugin
  pluginId = 'pluginId',
  pluginStart = 'pluginStart'
}

export enum ModuleOutputKeyEnum {
  // common
  userChatInput = 'userChatInput',
  finish = 'finish',
  history = 'history',
  answerText = 'answerText', // module answer. the value will be show and save to history
  success = 'success',
  failed = 'failed',
  text = 'system_text',
  addOutputParam = 'system_addOutputParam',

  // dataset
  datasetIsEmpty = 'isEmpty',
  datasetUnEmpty = 'unEmpty',
  datasetQuoteQA = 'quoteQA',

  // context extract
  contextExtractFields = 'fields',

  // tf switch
  resultTrue = 'system_resultTrue',
  resultFalse = 'system_resultFalse',

  // tools
  selectedTools = 'selectedTools',

  // http
  httpRawResponse = 'httpRawResponse',

  // plugin
  pluginStart = 'pluginStart'
}

export enum VariableInputEnum {
  input = 'input',
  textarea = 'textarea',
  select = 'select',
  external = 'external'
}
export const variableMap = {
  [VariableInputEnum.input]: {
    icon: 'core/app/variable/input',
    title: 'core.module.variable.input type',
    desc: ''
  },
  [VariableInputEnum.textarea]: {
    icon: 'core/app/variable/textarea',
    title: 'core.module.variable.textarea type',
    desc: '允许用户最多输入4000字的对话框。'
  },
  [VariableInputEnum.select]: {
    icon: 'core/app/variable/select',
    title: 'core.module.variable.select type',
    desc: ''
  },
  [VariableInputEnum.external]: {
    icon: 'core/app/variable/external',
    title: 'core.module.variable.External type',
    desc: '可以通过API接口或分享链接的Query传递变量。增加该类型变量的主要目的是用于变量提示。使用例子: 你可以通过分享链接Query中拼接Token，来实现内部系统身份鉴权。'
  }
};

export const DYNAMIC_INPUT_KEY = 'DYNAMIC_INPUT_KEY';

export enum SseResponseEventEnum {
    error = 'error',
    answer = 'answer', // animation stream
    fastAnswer = 'fastAnswer', // direct answer text, not animation
    flowNodeStatus = 'flowNodeStatus', // update node status
  
    toolCall = 'toolCall', // tool start
    toolParams = 'toolParams', // tool params return
    toolResponse = 'toolResponse', // tool response return
    flowResponses = 'flowResponses' // sse response request
  }
  
  export enum DispatchNodeResponseKeyEnum {
    nodeResponse = 'responseData', // run node response
    nodeDispatchUsages = 'nodeDispatchUsages', // the node bill.
    childrenResponses = 'childrenResponses', // Some nodes make recursive calls that need to be returned
    toolResponses = 'toolResponses', // The result is passed back to the tool node for use
    assistantResponses = 'assistantResponses' // assistant response
  }

  export enum UserStatusEnum {
    active = 'active',
    forbidden = 'forbidden'
  }
  
  export const userStatusMap = {
    [UserStatusEnum.active]: {
      label: 'support.user.status.active'
    },
    [UserStatusEnum.forbidden]: {
      label: 'support.user.status.forbidden'
    }
  };
  
  export enum OAuthEnum {
    github = 'github',
    google = 'google',
    wechat = 'wechat'
  }
  
  export enum ChatCompletionRequestMessageRoleEnum {
    'System' = 'system',
    'User' = 'user',
    'Assistant' = 'assistant',
    'Function' = 'function',
    'Tool' = 'tool'
  }
  
  export enum ChatMessageTypeEnum {
    text = 'text',
    image_url = 'image_url'
  }
  
  export enum LLMModelTypeEnum {
    all = 'all',
    classify = 'classify',
    extractFields = 'extractFields',
    toolCall = 'toolCall',
    queryExtension = 'queryExtension'
  }
  export const llmModelTypeFilterMap = {
    [LLMModelTypeEnum.all]: 'model',
    [LLMModelTypeEnum.classify]: 'usedInClassify',
    [LLMModelTypeEnum.extractFields]: 'usedInExtractFields',
    [LLMModelTypeEnum.toolCall]: 'usedInToolCall',
    [LLMModelTypeEnum.queryExtension]: 'usedInQueryExtension'
  };
  
  export enum EmbeddingTypeEnm {
    query = 'query',
    db = 'db'
  }
  
  /* ------------ dataset -------------- */
export enum DatasetTypeEnum {
  folder = 'folder',
  dataset = 'dataset',
  websiteDataset = 'websiteDataset' // depp link
}
export const DatasetTypeMap = {
  [DatasetTypeEnum.folder]: {
    icon: 'common/folderFill',
    label: 'core.dataset.Folder Dataset',
    collectionLabel: 'common.Folder'
  },
  [DatasetTypeEnum.dataset]: {
    icon: 'core/dataset/commonDataset',
    label: 'core.dataset.Common Dataset',
    collectionLabel: 'common.File'
  },
  [DatasetTypeEnum.websiteDataset]: {
    icon: 'core/dataset/websiteDataset',
    label: 'core.dataset.Website Dataset',
    collectionLabel: 'common.Website'
  }
};

export enum DatasetStatusEnum {
  active = 'active',
  syncing = 'syncing'
}
export const DatasetStatusMap = {
  [DatasetStatusEnum.active]: {
    label: 'core.dataset.status.active'
  },
  [DatasetStatusEnum.syncing]: {
    label: 'core.dataset.status.syncing'
  }
};

/* ------------ collection -------------- */
export enum DatasetCollectionTypeEnum {
  folder = 'folder',
  file = 'file',
  link = 'link', // one link
  virtual = 'virtual'
}
export const DatasetCollectionTypeMap = {
  [DatasetCollectionTypeEnum.folder]: {
    name: 'core.dataset.folder'
  },
  [DatasetCollectionTypeEnum.file]: {
    name: 'core.dataset.file'
  },
  [DatasetCollectionTypeEnum.link]: {
    name: 'core.dataset.link'
  },
  [DatasetCollectionTypeEnum.virtual]: {
    name: 'core.dataset.Manual collection'
  }
};

export enum DatasetCollectionSyncResultEnum {
  sameRaw = 'sameRaw',
  success = 'success'
}
export const DatasetCollectionSyncResultMap = {
  [DatasetCollectionSyncResultEnum.sameRaw]: {
    label: 'core.dataset.collection.sync.result.sameRaw'
  },
  [DatasetCollectionSyncResultEnum.success]: {
    label: 'core.dataset.collection.sync.result.success'
  }
};

/* ------------ data -------------- */

/* ------------ training -------------- */
export enum ImportDataSourceEnum {
  fileLocal = 'fileLocal',
  fileLink = 'fileLink',
  fileCustom = 'fileCustom',
  csvTable = 'csvTable'
}

export enum TrainingModeEnum {
  chunk = 'chunk',
  auto = 'auto',
  qa = 'qa'
}

export const TrainingTypeMap = {
  [TrainingModeEnum.chunk]: {
    label: 'core.dataset.training.Chunk mode',
    tooltip: 'core.dataset.import.Chunk Split Tip',
    openSource: true
  },
  [TrainingModeEnum.auto]: {
    label: 'core.dataset.training.Auto mode',
    tooltip: 'core.dataset.training.Auto mode Tip',
    openSource: false
  },
  [TrainingModeEnum.qa]: {
    label: 'core.dataset.training.QA mode',
    tooltip: 'core.dataset.import.QA Import Tip',
    openSource: true
  }
};

/* ------------ search -------------- */
export enum DatasetSearchModeEnum {
  embedding = 'embedding',
  fullTextRecall = 'fullTextRecall',
  mixedRecall = 'mixedRecall'
}

export const DatasetSearchModeMap = {
  [DatasetSearchModeEnum.embedding]: {
    icon: 'core/dataset/modeEmbedding',
    title: 'core.dataset.search.mode.embedding',
    desc: 'core.dataset.search.mode.embedding desc',
    value: DatasetSearchModeEnum.embedding
  },
  [DatasetSearchModeEnum.fullTextRecall]: {
    icon: 'core/dataset/fullTextRecall',
    title: 'core.dataset.search.mode.fullTextRecall',
    desc: 'core.dataset.search.mode.fullTextRecall desc',
    value: DatasetSearchModeEnum.fullTextRecall
  },
  [DatasetSearchModeEnum.mixedRecall]: {
    icon: 'core/dataset/mixedRecall',
    title: 'core.dataset.search.mode.mixedRecall',
    desc: 'core.dataset.search.mode.mixedRecall desc',
    value: DatasetSearchModeEnum.mixedRecall
  }
};

export enum SearchScoreTypeEnum {
  embedding = 'embedding',
  fullText = 'fullText',
  reRank = 'reRank',
  rrf = 'rrf'
}
export const SearchScoreTypeMap = {
  [SearchScoreTypeEnum.embedding]: {
    label: 'core.dataset.search.score.embedding',
    desc: 'core.dataset.search.score.embedding desc',
    showScore: true
  },
  [SearchScoreTypeEnum.fullText]: {
    label: 'core.dataset.search.score.fullText',
    desc: 'core.dataset.search.score.fullText desc',
    showScore: false
  },
  [SearchScoreTypeEnum.reRank]: {
    label: 'core.dataset.search.score.reRank',
    desc: 'core.dataset.search.score.reRank desc',
    showScore: true
  },
  [SearchScoreTypeEnum.rrf]: {
    label: 'core.dataset.search.score.rrf',
    desc: 'core.dataset.search.score.rrf desc',
    showScore: false
  }
};

export const CustomCollectionIcon = 'common/linkBlue';
export const LinkCollectionIcon = 'common/linkBlue';
