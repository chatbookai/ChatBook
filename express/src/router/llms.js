  // app.ts
  import express from 'express';

  import { checkUserToken } from '../utils/user.js';

  import { getLLMSSetting, uploadfiles, uploadfilesInsertIntoDb, filterString } from '../utils/utils.js';
  import { outputImage, outputImageOrigin, outputAvatarForApp, outputAvatarForDataset, outputAudio, chatChatBaiduWenxin, chatChatGemini, chatChatGeminiMindMap, chatOpenAI, chatDeepSeek, GenereateImageUsingDallE2, GenereateAudioUsingTTS, parseFilesAndWeb, ChatApp, vectorDdProcess } from '../utils/llms.js';
  import { llms } from '../config.js';
  import { ChatDatasetId, QA_TEMPLATE_INITIAL, REPHRASE_TEMPLATE_INITIAL } from '../utils/lancedb.js';

  const app = express();

  app.get('/api/parsefiles', async (req, res) => {
    parseFilesAndWeb();
    res.status(200).send("Execute finished, logs in the console or the log page");
    res.end();
  });

  app.get('/api/vectorDdProcess', async (req, res) => {
    vectorDdProcess();
    res.status(200).send("vectorDdProcess");
    res.end();
  });

  app.get('/api/dataset', async (req, res) => {

    const messages = [{role: "user", content: "什么是chivesweave?,请使用中文回复"}]
    const datasetId = "dMMHgv7ydA3UYV30a93mlnjI13Sblx4q"
    await ChatDatasetId(res, messages, datasetId, REPHRASE_TEMPLATE_INITIAL, QA_TEMPLATE_INITIAL);
    res.end();
  });
  
  app.post('/api/uploadfiles', uploadfiles().array('files', 10), async (req, res) => {
    const datasetId = req.body.datasetId
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') && datasetId) {
      uploadfilesInsertIntoDb(req.files, datasetId, checkUserTokenData.data.id);
      res.json({"status":"ok", "msg":"Uploaded Success"}).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/DallE2Openai', async (req, res) => {
    const question = req.body.question
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData = await getLLMSSetting("Dall-E-2");   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          const GenereateImageUsingDallE2Data = await GenereateImageUsingDallE2(res, checkUserTokenData.data.id, question, '1024x1024');
          res.status(200).json(GenereateImageUsingDallE2Data);
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/ChatOpenai', async (req, res) => {
    const { question, history, template, appId, _id, publishId, temperature} = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        await chatOpenAI(_id, res, checkUserTokenData.data.id, question, history, template, appId, publishId || '', 1, temperature);
        res.end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/ChatApp', async (req, res) => {
    const { question, history, template, appId, _id, publishId, allowChatLog, temperature, datasetId, DatasetPrompt } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        await ChatApp(_id, res, checkUserTokenData.data.id, question, history, template, appId, publishId || '', allowChatLog, temperature, datasetId, DatasetPrompt);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
        res.end();
    }
  });

  app.post('/api/ChatAppAnonymous', async (req, res) => {
    const { question, history, template, appId, publishId, _id, allowChatLog, temperature, datasetId, DatasetPrompt } = req.body;
    const { authorization } = req.headers;
    if(authorization && authorization.length == 32) {
        await ChatApp(_id, res, authorization, question, history, template, appId, publishId || '', allowChatLog, temperature, datasetId, DatasetPrompt);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
        res.end();
    }
  });
  
  app.post('/api/ChatGemini', async (req, res) => {
    const { question, history, template, appId, publishId, _id, allowChatLog} = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        await chatChatGemini(_id, res, checkUserTokenData.data.id, question, history, template, appId, publishId || '', allowChatLog);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/ChatBaiduwenxin', async (req, res) => {
    const { question, history, template, appId } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const chatChatBaiduWenxinData = await chatChatBaiduWenxin(res, checkUserTokenData.data.id, question, history, template, appId);    
      res.status(200).json(chatChatBaiduWenxinData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/TTS-1', async (req, res) => {
    const question = req.body.question
    const voice = req.body.voice
    const appId = req.body.appId
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData = await getLLMSSetting("TTS-1");   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", checkUserTokenData.data.id, question, voice, appId);
          res.status(200).json(GenereateAudioUsingTTSData);
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/audio/:file', async (req, res) => {
    const { file }= req.params;
    outputAudio(res, file);
  });

  app.get('/api/image/:file', async (req, res) => {
    const { file } = req.params;
    outputImage(res, file);

  });

  app.get('/api/avatarforapp/:file', async (req, res) => {
    const { file } = req.params;
    outputAvatarForApp(res, file);

  });

  app.get('/api/avatarfordataset/:file', async (req, res) => {
    const { file } = req.params;
    outputAvatarForDataset(res, file);

  });

  app.get('/api/imageorigin/:file', async (req, res) => {
    const { file } = req.params;
    outputImageOrigin(res, file);
  });

  app.get('/api/llms', async (req, res) => {
    res.status(200).json(llms)
  });
  

  export default app;
