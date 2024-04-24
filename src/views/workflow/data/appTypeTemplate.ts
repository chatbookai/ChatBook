
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
*/
