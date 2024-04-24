
export const allNodesData: any = {
    "_id": "660d13ad361cf48ed91321fb",
    "teamId": "65ad85ddb9c540f1cfe0f22f",
    "tmbId": "65ad85ddb9c540f1cfe0f231",
    "id": "simpleChat",
    "name": "simpleChat",
    "avatar": "/icon/logo.svg",
    "intro": "一个极其简单的 AI 应用，你可以绑定知识库或工具。",
    "type": "simple",
    "modules": [
      {
          "id": "userGuideNodeInitial_1",
          "type": "userGuide",
          "data": {
              "id": "userGuideNodeInitial_1",
              "templateType": "userGuide",
              "flowType": "userGuide",
              "avatar": "/imgs/module/userGuide.png",
              "name": "System Setting",
              "intro": "userGuideTip",
              "inputs": [
                  {
                      "key": "welcomeText",
                      "type": "hidden",
                      "valueType": "string",
                      "label": "WelcomeText",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false,
                      "value": "welcomeTextInitial"
                  },
                  {
                      "key": "variables",
                      "type": "hidden",
                      "valueType": "any",
                      "label": "ModuleVariable",
                      "value": [],
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "questionGuide",
                      "valueType": "boolean",
                      "type": "switch",
                      "label": "QuestionGuide",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "tts",
                      "type": "hidden",
                      "valueType": "any",
                      "label": "Tts",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  }
              ],
              "outputs": [],
              "moduleId": "userGuide"
          },
          "position": {
              "x": 454.98510354678695,
              "y": 721.4016845336229
          }
      },
      {
          "id": "questionInputNodeInitial_1",
          "type": "questionInput",
          "data": {
              "id": "questionInputNodeInitial_1",
              "templateType": "systemInput",
              "flowType": "questionInput",
              "avatar": "/imgs/module/userChatInput.svg",
              "name": "Chat entrance",
              "intro": "userChatInputIntro",
              "inputs": [
                  {
                      "key": "userChatInput",
                      "type": "systemInput",
                      "valueType": "string",
                      "label": "user question",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  }
              ],
              "outputs": [
                  {
                      "key": "questionInputNodeInitial_1_output",
                      "label": "user question",
                      "type": "source",
                      "valueType": "string",
                      "targets": [
                          {
                              "moduleId": "Targets***moduleId",
                              "key": "Targets***key"
                          }
                      ]
                  }
              ],
              "moduleId": "questionInputNodeInitial_1_moduleId"
          },
          "position": {
              "x": 450,
              "y": 1350
          }
      },
      {
          "id": "chatNodeInitial_1",
          "type": "chatNode",
          "data": {
              "id": "chatNodeInitial_1",
              "templateType": "textAnswer",
              "flowType": "chatNode",
              "avatar": "/imgs/module/AI.png",
              "name": "AI Chat",
              "intro": "AI Model Chat",
              "showStatus": true,
              "isTool": true,
              "inputs": [
                  {
                      "key": "switch",
                      "type": "hidden",
                      "label": "",
                      "description": "Trigger",
                      "valueType": "any",
                      "showTargetInApp": true,
                      "showTargetInPlugin": true
                  },
                  {
                      "key": "model",
                      "type": "selectLLMModel",
                      "label": "aiModel",
                      "required": true,
                      "valueType": "string",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false,
                      "value": "gpt-3.5-turbo"
                  },
                  {
                      "key": "temperature",
                      "type": "hidden",
                      "label": "",
                      "value": 0,
                      "valueType": "number",
                      "min": 0,
                      "max": 10,
                      "step": 1,
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "maxToken",
                      "type": "hidden",
                      "label": "",
                      "value": 8000,
                      "valueType": "number",
                      "min": 100,
                      "max": 4000,
                      "step": 50,
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "isResponseAnswerText",
                      "type": "hidden",
                      "label": "",
                      "value": true,
                      "valueType": "boolean",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "quoteTemplate",
                      "type": "hidden",
                      "label": "",
                      "valueType": "string",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "quotePrompt",
                      "type": "hidden",
                      "label": "",
                      "valueType": "string",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false
                  },
                  {
                      "key": "systemPrompt",
                      "type": "textarea",
                      "max": 3000,
                      "valueType": "string",
                      "label": "NodeChatPrompt",
                      "description": "chatNodeSystemPromptTip",
                      "placeholder": "chatNodeSystemPromptTip",
                      "showTargetInApp": true,
                      "showTargetInPlugin": true
                  },
                  {
                      "key": "history",
                      "type": "numberInput",
                      "label": "chat history",
                      "required": true,
                      "min": 0,
                      "max": 30,
                      "valueType": "chatHistory",
                      "value": 6,
                      "showTargetInApp": true,
                      "showTargetInPlugin": true
                  },
                  {
                      "key": "userChatInput",
                      "type": "systemInput",
                      "label": "",
                      "required": true,
                      "valueType": "string",
                      "showTargetInApp": true,
                      "showTargetInPlugin": true,
                      "toolDescription": "user question"
                  },
                  {
                      "key": "quoteQA",
                      "type": "settingDatasetQuotePrompt",
                      "label": "KnowledgeBaseRef",
                      "description": "Input description",
                      "valueType": "datasetQuote",
                      "showTargetInApp": true,
                      "showTargetInPlugin": true
                  },
                  {
                      "key": "aiSettings",
                      "type": "aiSettings",
                      "label": "",
                      "valueType": "any",
                      "showTargetInApp": false,
                      "showTargetInPlugin": false,
                      "connected": false
                  }
              ],
              "outputs": [
                  {
                      "key": "answerText",
                      "label": "Ai response content",
                      "description": "Ai response content",
                      "valueType": "string",
                      "type": "source",
                      "targets": []
                  },
                  {
                      "key": "finish",
                      "label": "",
                      "description": "",
                      "valueType": "boolean",
                      "type": "hidden",
                      "targets": []
                  },
                  {
                      "key": "history",
                      "label": "New context",
                      "description": "New context",
                      "valueType": "chatHistory",
                      "type": "source",
                      "targets": []
                  },
                  {
                      "key": "userChatInput",
                      "label": "user question",
                      "type": "hidden",
                      "valueType": "string",
                      "targets": []
                  }
              ],
              "moduleId": "chatModule"
          },
          "position": {
              "x": 1150.8317145593148,
              "y": 720
          }
      },
      {
        "id": "assignedReply_1",
        "type": "assignedReply",
        "data": {
            "id": "assignedReply_1",
            "templateType": "assignedReply",
            "flowType": "assignedReply",
            "avatar": "/imgs/module/reply.png",
            "name": "Assigned reply",
            "intro": "Assigned reply intro",
            "inputs": [
                {
                  "key": "switch",
                  "type": "hidden",
                  "label": "",
                  "description": "Trigger",
                  "valueType": "any",
                  "showTargetInApp": true,
                  "showTargetInPlugin": true,
                  "connected": false
                },
                {
                  "key": "text",
                  "type": "textarea",
                  "valueType": "any",
                  "label": "Response content",
                  "description": "Response content help",
                  "placeholder": "Response content help",
                  "showTargetInApp": true,
                  "showTargetInPlugin": true,
                  "connected": false
                }
              ],
            "outputs": [
              {
                "key": "finish",
                "label": "",
                "description": "",
                "valueType": "boolean",
                "type": "hidden",
                "targets": []
              }
            ],
            "moduleId": "assignedReply_1"
        },
        "position": {
            "x": 1800,
            "y": 721
        }
      },
      {
        "id": "classifyQuestion_1",
        "type": "classifyQuestion",
        "data": {
            "id": "classifyQuestion_1",
            "templateType": "classifyQuestion",
            "flowType": "classifyQuestion",
            "avatar": "/imgs/module/cq.png",
            "name": "Classify question",
            "intro": "Classify question intro",
            "inputs": [
                {
                "key": "switch",
                "type": "hidden",
                "label": "",
                "description": "Trigger",
                "valueType": "any",
                "showTargetInApp": true,
                "showTargetInPlugin": true,
                "connected": false
                },
                {
                "key": "model",
                "type": "selectLLMModel",
                "label": "aiModel",
                "required": true,
                "valueType": "string",
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "llmModelType": "classify",
                "value": "gpt-3.5-turbo",
                "connected": false
                },
                {
                "key": "systemPrompt",
                "type": "textarea",
                "max": 3000,
                "valueType": "string",
                "label": "Background",
                "description": "Background help",
                "placeholder": "Classify background",
                "showTargetInApp": true,
                "showTargetInPlugin": true,
                "connected": false
                },
                {
                "key": "history",
                "type": "numberInput",
                "label": "chat history",
                "required": true,
                "min": 0,
                "max": 30,
                "valueType": "chatHistory",
                "value": 6,
                "showTargetInApp": true,
                "showTargetInPlugin": true,
                "connected": false
                },
                {
                "key": "userChatInput",
                "type": "systemInput",
                "label": "",
                "required": true,
                "valueType": "string",
                "showTargetInApp": true,
                "showTargetInPlugin": true,
                "toolDescription": "user question",
                "connected": true
                },
                {
                "key": "classifyQuestion",
                "type": "classifyQuestion",
                "valueType": "any",
                "label": "",
                "value": [
                    {
                    "value": "打招呼",
                    "key": "1"
                    },
                    {
                    "value": "关于 xxx 的问题",
                    "key": "2"
                    },
                    {
                    "value": "其他问题",
                    "key": "3"
                    },
                    {
                    "value": "",
                    "key": "4"
                    }
                ],
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "connected": false
                }
            ],
            "outputs": [
                {
                "key": "userChatInput",
                "label": "user question",
                "type": "hidden",
                "valueType": "string",
                "targets": []
                },
                {
                "key": "wqre",
                "label": "",
                "type": "hidden",
                "targets": []
                },
                {
                "key": "sdfa",
                "label": "",
                "type": "hidden",
                "targets": []
                },
                {
                "key": "agex",
                "label": "",
                "type": "hidden",
                "targets": []
                }
            ],
            "moduleId": "classifyQuestion_1"
        },
        "position": {
            "x": 2000,
            "y": 721
        }
      },
      {
        "id": "contentExtract_1",
        "type": "contentExtract",
        "data": {
            "id": "contentExtract_1",
            "templateType": "contentExtract",
            "flowType": "contentExtract",
            "avatar": "/imgs/module/extract.png",
            "name": "Extract field",
            "intro": "Extract field intro",
            "inputs": [
                {
                  "key": "switch",
                  "type": "hidden",
                  "label": "",
                  "description": "Trigger",
                  "valueType": "any",
                  "showTargetInApp": true,
                  "showTargetInPlugin": true,
                  "connected": false
                },
                {
                  "key": "model",
                  "type": "selectLLMModel",
                  "label": "aiModel",
                  "required": true,
                  "valueType": "string",
                  "showTargetInApp": false,
                  "showTargetInPlugin": false,
                  "llmModelType": "extractFields",
                  "value": "gpt-3.5-turbo",
                  "connected": false
                },
                {
                  "key": "description",
                  "type": "textarea",
                  "valueType": "string",
                  "label": "提取要求描述",
                  "description": "给AI一些对应的背景知识或要求描述，引导AI更好的完成任务。\n该输入框可使用全局变量。",
                  "placeholder": "例如: \n1. 当前时间为: {{cTime}}。你是一个实验室预约助手，你的任务是帮助用户预约实验室，从文本中获取对应的预约信息。\n2. 你是谷歌搜索助手，需要从文本中提取出合适的搜索词。",
                  "showTargetInApp": true,
                  "showTargetInPlugin": true,
                  "value": "",
                  "connected": false
                },
                {
                  "key": "history",
                  "type": "numberInput",
                  "label": "chat history",
                  "required": true,
                  "min": 0,
                  "max": 30,
                  "valueType": "chatHistory",
                  "value": 6,
                  "showTargetInApp": true,
                  "showTargetInPlugin": true,
                  "connected": false
                },
                {
                  "key": "extractContent",
                  "type": "extractContent",
                  "label": "需要提取的文本",
                  "required": true,
                  "valueType": "string",
                  "showTargetInApp": true,
                  "showTargetInPlugin": true,
                  "toolDescription": "需要检索的内容",
                  "connected": true
                },
                {
                  "key": "extractKeys",
                  "type": "extractKeys",
                  "label": "",
                  "valueType": "any",
                  "description": "由 '描述' 和 'key' 组成一个目标字段，可提取多个目标字段",
                  "showTargetInApp": false,
                  "showTargetInPlugin": false,
                  "value": [
                    {
                    "description": "变量描述",
                    "key": "变量KEY",
                    "required": true,
                    "default": "default",
                    "enumValue": "A,B,C"
                    },
                    {
                    "description": "关于 xxx 的问题",
                    "key": "2",
                    "required": true,
                    "default": "",
                    "enumValue": "A,B,C"
                    },
                    {
                    "description": "其他问题",
                    "key": "3",
                    "required": true,
                    "default": "",
                    "enumValue": "A,B,C"
                    },
                    {
                    "description": "",
                    "key": "4",
                    "required": false,
                    "default": "",
                    "enumValue": ""
                    }
                  ],
                  "connected": false
                }
            ],
            "outputs": [
                {
                  "key": "success",
                  "label": "字段完全提取",
                  "valueType": "boolean",
                  "type": "source",
                  "targets": []
                },
                {
                  "key": "failed",
                  "label": "提取字段缺失",
                  "description": "存在一个或多个字段未提取成功。尽管使用了默认值也算缺失。",
                  "valueType": "boolean",
                  "type": "source",
                  "targets": []
                },
                {
                  "key": "fields",
                  "label": "完整提取结果",
                  "description": "一个 JSON 字符串，例如：{\"name:\":\"YY\",\"Time\":\"2023/7/2 18:00\"}",
                  "valueType": "string",
                  "type": "source",
                  "targets": []
                }
            ],
            "moduleId": "contentExtract_1"
        },
        "position": {
            "x": 2100,
            "y": 721
        }
      },
      {
        "id": "httpRequest_1",
        "type": "httpRequest",
        "data": {
            "id": "httpRequest_1",
            "templateType": "httpRequest",
            "flowType": "httpRequest",
            "avatar": "/imgs/module/http.png",
            "name": "Http request",
            "intro": "Http request intro",
            "inputs": [
              {
                "key": "switch",
                "type": "hidden",
                "label": "",
                "description": "Trigger",
                "valueType": "any",
                "showTargetInApp": true,
                "showTargetInPlugin": true,
                "connected": true
              },
              {
                "key": "httpMethod",
                "type": "httpMethod",
                "valueType": "string",
                "label": "Http request settings",
                "value": "POST",
                "httpReqUrl": "https://",
                "required": true,
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "connected": false
              },
              {
                "key": "httpParams",
                "type": "httpParams",   
                "valueType": "any",
                "valueParams": [{
                    "key": "Accept-Charset",
                    "type": "string",
                    "value": ""
                  },
                  {
                    "key": "Accept-Encoding",
                    "type": "string",
                    "value": ""
                  }],
                "valueBody": "valueBody",
                "valueHeader": [{
                    "key": "Accept-Charset",
                    "type": "string",
                    "value": ""
                  },
                  {
                    "key": "Accept-Encoding",
                    "type": "string",
                    "value": ""
                  }],
                "label": "Http request props",
                "description": "Props tip",
                "placeholder": "Http Request Header",
                "required": false,
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "connected": false
              },
              {
                "key": "httpParams",
                "type": "hidden",
                "valueType": "any",
                "value": [],
                "label": "",
                "required": false,
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "connected": false
              },
              {
                "key": "httpJsonBody",
                "type": "hidden",
                "valueType": "any",
                "value": "",
                "label": "",
                "required": false,
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "connected": false
              },
              {
                "key": "DYNAMIC_INPUT_KEY",
                "type": "target",
                "valueType": "any",
                "label": "core.module.inputType.dynamicTargetInput",
                "description": "dynamic input",
                "required": false,
                "showTargetInApp": false,
                "showTargetInPlugin": true,
                "hideInApp": true,
                "connected": false
              },
              {
                "key": "system_addInputParam",
                "type": "addInputParam",
                "valueType": "any",
                "label": "",
                "required": false,
                "showTargetInApp": false,
                "showTargetInPlugin": false,
                "editField": {
                  "key": true,
                  "description": true,
                  "dataType": true
                },
                "defaultEditField": {
                  "label": "",
                  "key": "",
                  "description": "",
                  "inputType": "target",
                  "valueType": "string"
                },
                "connected": false
              }
            ],
            "outputs": [
              {
                "key": "httpRawResponse",
                "label": "原始响应",
                "description": "HTTP请求的原始响应。只能接受字符串或JSON类型响应数据。",
                "valueType": "any",
                "type": "source",
                "targets": []
              },
              {
                "key": "system_addOutputParam",
                "type": "addOutputParam",
                "valueType": "any",
                "label": "",
                "targets": [],
                "editField": {
                  "key": true,
                  "description": true,
                  "dataType": true,
                  "defaultValue": true
                },
                "defaultEditField": {
                  "label": "",
                  "key": "",
                  "description": "",
                  "outputType": "source",
                  "valueType": "string"
                }
              },
              {
                "key": "finish",
                "label": "",
                "description": "",
                "valueType": "boolean",
                "type": "hidden",
                "targets": []
              }
            ],
            "moduleId": "httpRequest_1"
        },
        "position": {
            "x": 1400,
            "y": 900
        }
      }
    ],
    "edges":  [
      {
        id: "bmf6r1",
        source: "questionInputNodeInitial_1",
        sourceHandle: "userChatInput",
        target: "chatNodeInitial_1",
        targetHandle: "userChatInput_Left",
        type: "buttonedge",
        animated: true,
        style: { stroke: '#00BFFF', strokeWidth: 4 }
      },
      {
        id: "bmf6r2",
        source: "questionInputNodeInitial_1",
        sourceHandle: "userChatInput",
        target: "chatNodeInitial_1",
        targetHandle: "systemPrompt_Left",
        type: "buttonedge",
        animated: true,
        style: { stroke: '#00BFFF', strokeWidth: 4 }
      }
    ],
    "permission": "private",
    "teamTags": [],
    "updateTime": "2024-04-03T08:30:37.267Z",
    "isOwner": true,
    "canWrite": true
}

