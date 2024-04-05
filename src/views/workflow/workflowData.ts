import { Node, Edge, Position, MarkerType } from 'reactflow';

export const workflowData: any = {
    "_id": "660d13ad361cf48ed91321fb",
    "teamId": "65ad85ddb9c540f1cfe0f22f",
    "tmbId": "65ad85ddb9c540f1cfe0f231",
    "name": "简易模板",
    "type": "simple",
    "avatar": "/icon/logo.svg",
    "intro": "",
    "modules": [
        {
            "moduleId": "userGuide",
            "name": "用户引导",
            "avatar": "/imgs/module/userGuide.png",
            "flowType": "userGuide",
            "position": {
                "x": 454.98510354678695,
                "y": 721.4016845336229
            },
            "inputs": [
                {
                    "key": "welcomeText",
                    "type": "hidden",
                    "valueType": "string",
                    "label": "",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "variables",
                    "type": "hidden",
                    "valueType": "any",
                    "label": "",
                    "value": [],
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "questionGuide",
                    "valueType": "boolean",
                    "type": "switch",
                    "label": "",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "tts",
                    "type": "hidden",
                    "valueType": "any",
                    "label": "",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                }
            ],
            "outputs": []
        },
        {
            "moduleId": "userChatInput",
            "name": "对话入口",
            "avatar": "/imgs/module/userChatInput.png",
            "flowType": "questionInput",
            "position": {
                "x": 464.32198615344566,
                "y": 1602.2698463081606
            },
            "inputs": [
                {
                    "key": "userChatInput",
                    "type": "systemInput",
                    "valueType": "string",
                    "label": "core.module.input.label.user question",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                }
            ],
            "outputs": [
                {
                    "key": "userChatInput",
                    "label": "core.module.input.label.user question",
                    "type": "source",
                    "valueType": "string",
                    "targets": [
                        {
                            "moduleId": "chatModule",
                            "key": "userChatInput"
                        }
                    ]
                }
            ]
        },
        {
            "moduleId": "chatModule",
            "name": "AI 对话",
            "avatar": "/imgs/module/AI.png",
            "flowType": "chatNode",
            "showStatus": true,
            "position": {
                "x": 1150.8317145593148,
                "y": 957.9676672880053
            },
            "inputs": [
                {
                    "key": "switch",
                    "type": "target",
                    "label": "core.module.input.label.switch",
                    "valueType": "any",
                    "showTargetInApp": true,
                    "showTargetInPlugin": true,
                    "connected": false
                },
                {
                    "key": "model",
                    "type": "selectLLMModel",
                    "label": "core.module.input.label.aiModel",
                    "required": true,
                    "valueType": "string",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "value": "gpt-3.5-turbo",
                    "connected": false
                },
                {
                    "key": "temperature",
                    "type": "hidden",
                    "label": "温度",
                    "value": 0,
                    "valueType": "number",
                    "min": 0,
                    "max": 10,
                    "step": 1,
                    "markList": [
                        {
                            "label": "严谨",
                            "value": 0
                        },
                        {
                            "label": "发散",
                            "value": 10
                        }
                    ],
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "maxToken",
                    "type": "hidden",
                    "label": "回复上限",
                    "value": 8000,
                    "valueType": "number",
                    "min": 100,
                    "max": 4000,
                    "step": 50,
                    "markList": [
                        {
                            "label": "100",
                            "value": 100
                        },
                        {
                            "label": "4000",
                            "value": 4000
                        }
                    ],
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "isResponseAnswerText",
                    "type": "hidden",
                    "label": "返回AI内容",
                    "value": true,
                    "valueType": "boolean",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "quoteTemplate",
                    "type": "hidden",
                    "label": "引用内容模板",
                    "valueType": "string",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "quotePrompt",
                    "type": "hidden",
                    "label": "引用内容提示词",
                    "valueType": "string",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "aiSettings",
                    "type": "aiSettings",
                    "label": "",
                    "valueType": "any",
                    "showTargetInApp": false,
                    "showTargetInPlugin": false,
                    "connected": false
                },
                {
                    "key": "systemPrompt",
                    "type": "textarea",
                    "label": "core.ai.Prompt",
                    "max": 300,
                    "valueType": "string",
                    "description": "模型固定的引导词，通过调整该内容，可以引导模型聊天方向。该内容会被固定在上下文的开头。可使用变量，例如 {{language}}",
                    "placeholder": "模型固定的引导词，通过调整该内容，可以引导模型聊天方向。该内容会被固定在上下文的开头。可使用变量，例如 {{language}}",
                    "showTargetInApp": true,
                    "showTargetInPlugin": true,
                    "connected": false
                },
                {
                    "key": "history",
                    "type": "numberInput",
                    "label": "core.module.input.label.chat history",
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
                    "key": "quoteQA",
                    "type": "target",
                    "label": "引用内容",
                    "description": "对象数组格式，结构：\n [{q:'问题',a:'回答'}]",
                    "valueType": "datasetQuote",
                    "showTargetInApp": true,
                    "showTargetInPlugin": true,
                    "connected": false
                },
                {
                    "key": "userChatInput",
                    "type": "target",
                    "label": "core.module.input.label.user question",
                    "required": true,
                    "valueType": "string",
                    "showTargetInApp": true,
                    "showTargetInPlugin": true,
                    "connected": true
                }
            ],
            "outputs": [
                {
                    "key": "answerText",
                    "label": "AI回复",
                    "description": "将在 stream 回复完毕后触发",
                    "valueType": "string",
                    "type": "source",
                    "targets": []
                },
                {
                    "key": "finish",
                    "label": "core.module.output.label.running done",
                    "description": "core.module.output.description.running done",
                    "valueType": "boolean",
                    "type": "source",
                    "targets": []
                },
                {
                    "key": "history",
                    "label": "新的上下文",
                    "description": "将本次回复内容拼接上历史记录，作为新的上下文返回",
                    "valueType": "chatHistory",
                    "type": "source",
                    "targets": []
                }
            ]
        }
    ],
    "permission": "private",
    "teamTags": [],
    "updateTime": "2024-04-03T08:30:37.267Z",
    "__v": 0,
    "isOwner": true,
    "canWrite": true
}

export const initialNodes: Node[] = [
    {
      id: 'button-1',
      type: 'input',
      data: { label: 'Button Edge 1' },
      position: { x: 125, y: 0 },
    },
    {
      id: 'button-2',
      data: { label: 'Button Edge 2' },
      position: { x: 125, y: 200 },
    },
    {
      id: 'bi-1',
      data: { label: 'Bi Directional 1' },
      position: { x: 0, y: 300 },
      type: 'bidirectional',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'bi-2',
      data: { label: 'Bi Directional 2' },
      position: { x: 250, y: 300 },
      type: 'bidirectional',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: 'self-1',
      data: { label: 'Self Connecting' },
      position: { x: 125, y: 500 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
  ];
  
export const initialEdges: Edge[] = [
    {
      id: 'edge-button',
      source: 'button-1',
      target: 'button-2',
      type: 'buttonedge',
    },
    {
      id: 'edge-bi-1',
      source: 'bi-1',
      target: 'bi-2',
      type: 'bidirectional',
      sourceHandle: 'right',
      targetHandle: 'left',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'edge-bi-2',
      source: 'bi-2',
      target: 'bi-1',
      type: 'bidirectional',
      sourceHandle: 'left',
      targetHandle: 'right',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'edge-self',
      source: 'self-1',
      target: 'self-1',
      type: 'selfconnecting',
      markerEnd: { type: MarkerType.Arrow },
    },
  ];