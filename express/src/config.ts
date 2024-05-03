
export const llms = {
    "llmModels": [
      {
        "model": "gpt-3.5-turbo",
        "name": "gpt-3.5-turbo",
        "maxContext": 16000,
        "avatar": "/imgs/model/openai.svg",
        "maxResponse": 4000,
        "quoteMaxToken": 13000,
        "maxTemperature": 1.2,
        "charsPointsPrice": 0,
        "censor": false,
        "vision": false,
        "datasetProcess": true,
        "usedInClassify": true,
        "usedInExtractFields": true,
        "usedInToolCall": true,
        "usedInQueryExtension": true,
        "toolChoice": true,
        "functionCall": true,
        "customCQPrompt": "",
        "customExtractPrompt": "",
        "defaultSystemChatPrompt": "",
        "defaultConfig": {}
      },
      {
        "model": "gpt-4-0125-preview",
        "name": "gpt-4-turbo",
        "avatar": "/imgs/model/openai.svg",
        "maxContext": 125000,
        "maxResponse": 4000,
        "quoteMaxToken": 100000,
        "maxTemperature": 1.2,
        "charsPointsPrice": 0,
        "censor": false,
        "vision": false,
        "datasetProcess": false,
        "usedInClassify": true,
        "usedInExtractFields": true,
        "usedInToolCall": true,
        "usedInQueryExtension": true,
        "toolChoice": true,
        "functionCall": false,
        "customCQPrompt": "",
        "customExtractPrompt": "",
        "defaultSystemChatPrompt": "",
        "defaultConfig": {}
      },
      {
        "model": "gpt-4-vision-preview",
        "name": "gpt-4-vision",
        "avatar": "/imgs/model/openai.svg",
        "maxContext": 128000,
        "maxResponse": 4000,
        "quoteMaxToken": 100000,
        "maxTemperature": 1.2,
        "charsPointsPrice": 0,
        "censor": false,
        "vision": true,
        "datasetProcess": false,
        "usedInClassify": false,
        "usedInExtractFields": false,
        "usedInToolCall": false,
        "usedInQueryExtension": false,
        "toolChoice": true,
        "functionCall": false,
        "customCQPrompt": "",
        "customExtractPrompt": "",
        "defaultSystemChatPrompt": "",
        "defaultConfig": {}
      }
    ],
    "vectorModels": [
      {
        "model": "text-embedding-ada-002",
        "name": "Embedding-2",
        "avatar": "/imgs/model/openai.svg",
        "charsPointsPrice": 0,
        "defaultToken": 512,
        "maxToken": 3000,
        "weight": 100,
        "dbConfig": {},
        "queryConfig": {}
      }
    ],
    "reRankModels": [],
    "audioSpeechModels": [
      {
        "model": "tts-1",
        "name": "OpenAI TTS1",
        "charsPointsPrice": 0,
        "voices": [
          {
            "label": "Alloy",
            "value": "alloy",
            "bufferId": "openai-Alloy"
          },
          {
            "label": "Echo",
            "value": "echo",
            "bufferId": "openai-Echo"
          },
          {
            "label": "Fable",
            "value": "fable",
            "bufferId": "openai-Fable"
          },
          {
            "label": "Onyx",
            "value": "onyx",
            "bufferId": "openai-Onyx"
          },
          {
            "label": "Nova",
            "value": "nova",
            "bufferId": "openai-Nova"
          },
          {
            "label": "Shimmer",
            "value": "shimmer",
            "bufferId": "openai-Shimmer"
          }
        ]
      }
    ],
    "whisperModel": {
      "model": "whisper-1",
      "name": "Whisper1",
      "charsPointsPrice": 0
    }
}
