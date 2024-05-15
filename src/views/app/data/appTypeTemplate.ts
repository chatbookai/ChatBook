export const appGroup = "写作,代码,软件开发,技术,英语,企业,研究,沟通,联网,前端,电子商务,人工智能,设计师,Typescript"

export const appTemplates: any[] = [
    {
      id: 'simpleChat',
      avatar: '/imgs/module/AI.png',
      name: '简易模板',
      intro: '一个极其简单的 AI 应用，你可以绑定知识库或工具。',
      type: "simpleChat"
    },
    {
      id: 'chatGuide',
      avatar: '/imgs/module/userGuide.png',
      name: '对话引导 + 变量',
      intro: '可以在对话开始发送一段提示，或者让用户填写一些内容，作为本次对话的变量',
      type: "chatGuide"
    },
    {
      id: 'simpleDatasetChat',
      avatar: '/imgs/module/db.png',
      name: '知识库+对话引导',
      intro: '每次提问时进行一次知识库搜索，将搜索结果注入 LLM 模型进行参考回答',
      type: "simpleDatasetChat"
    },
    {
      id: 'ClassifyQuestion',
      avatar: '/imgs/module/cq.png',
      name: '问题分类 + 知识库',
      intro: '先对用户的问题进行分类，再根据不同类型问题，执行不同的操作',
      type: "advanced"
    }
];


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
            "templateType": "assignedReply",
            "flowType": "assignedReply",
            "avatar": "/imgs/module/reply.png",
            "name": "Assigned reply",
            "intro": "Assigned reply intro",
        }
    ],

    "Function module": [
        {
            "templateType": "classifyQuestion",
            "flowType": "classifyQuestion",
            "avatar": "/imgs/module/cq.png",
            "name": "Classify question",
            "intro": "Classify question intro",
        },
        {
            "templateType": "contentExtract",
            "flowType": "contentExtract",
            "avatar": "/imgs/module/extract.png",
            "name": "Extract field",
            "intro": "Extract field intro",
        }
    ],
    
    "External module": [
        {
            "templateType": "httpRequest",
            "flowType": "httpRequest",
            "avatar": "/imgs/module/http.png",
            "name": "Http request",
            "intro": "Http request intro",
        },
    ]
}


/*
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

"System input module": [
    {
        "templateType": "SystemInput",
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
*/
