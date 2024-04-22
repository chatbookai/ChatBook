
export const workflowData: any = {
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
                      "type": "settingLLMModel",
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
                      "type": "custom",
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
          "id": "chatNodeInitial_2",
          "type": "chatNode",
          "data": {
              "id": "chatNodeInitial_2",
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
                      "type": "settingLLMModel",
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
                      "type": "custom",
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
              "x": 1300,
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
      },
      {
        id: "bmf6r3",
        source: "questionInputNodeInitial_1",
        sourceHandle: "userChatInput",
        target: "chatNodeInitial_2",
        targetHandle: "userChatInput_Left",
        type: "buttonedge",
        animated: true,
        style: { stroke: '#808080', strokeWidth: 4 }
      },
      {
        id: "bmf6r4",
        source: "questionInputNodeInitial_1",
        sourceHandle: "userChatInput",
        target: "chatNodeInitial_2",
        targetHandle: "systemPrompt_Left",
        type: "buttonedge",
        animated: true,
        style: { stroke: '#808080', strokeWidth: 4 }
      }
    ],
    "permission": "private",
    "teamTags": [],
    "updateTime": "2024-04-03T08:30:37.267Z",
    "isOwner": true,
    "canWrite": true
}


export const appTypeTemplate: {[key: string]: any[]} = {
    "Response module": [
        {
            "templateType": "textAnswer",
            "flowType": "chatNode",
            "avatar": "/imgs/module/AI.png",
            "name": "AI Chat",
            "intro": "AI Model Chat",
        },
        {
            "templateType": "AssignedReply",
            "flowType": "AssignedReply",
            "avatar": "/imgs/module/reply.png",
            "name": "Assigned reply",
            "intro": "Assigned reply intro",
        }
    ],

    "Function module": [
        {
            "templateType": "DatasetSearch",
            "flowType": "DatasetSearch",
            "avatar": "/imgs/module/db.png",
            "name": "Dataset search",
            "intro": "Dataset search intro",
        },
        {
            "templateType": "ToolCall",
            "flowType": "ToolCall",
            "avatar": "/imgs/module/userChatInput.svg",
            "name": "Tool call",
            "intro": "Tool call tip",
        },
        {
            "templateType": "ToolCallStop",
            "flowType": "ToolCallStop",
            "avatar": "/imgs/module/tool.svg",
            "name": "Tool call stop",
            "intro": "Tool call stop tip",
        },
        {
            "templateType": "ClassifyQuestion",
            "flowType": "ClassifyQuestion",
            "avatar": "/imgs/module/cq.png",
            "name": "Classify question",
            "intro": "Classify question intro",
        },
        {
            "templateType": "ExtractField",
            "flowType": "ExtractField",
            "avatar": "/imgs/module/extract.png",
            "name": "Extract field",
            "intro": "Extract field intro",
        }
    ],
    
    "External module": [
        {
            "templateType": "Http request",
            "flowType": "Http request",
            "avatar": "/imgs/module/http.png",
            "name": "Http request",
            "intro": "Http request intro",
        },
    ],
    
    "System input module": [
        {
            "templateType": "systemInput",
            "flowType": "questionInput",
            "avatar": "/imgs/module/userChatInput.png",
            "name": "Chat entrance",
            "intro": "Chat entrance intro",
        },
        {
            "templateType": "userGuide",
            "flowType": "userGuide",
            "avatar": "/imgs/module/userGuide.png",
            "name": "System Setting",
            "intro": "userGuideTip",
        },
    ]
}
