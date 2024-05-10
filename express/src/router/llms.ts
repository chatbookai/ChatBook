  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';

  import { getLLMSSetting, uploadfiles, uploadfilesInsertIntoDb, filterString } from '../utils/utils';
  import { outputImage, outputImageOrigin, outputAvatarForApp, outputAudio, chatChatBaiduWenxin, chatChatGemini, chatChatGeminiMindMap, chatChatOpenAI, chatChatDeepSeek, chatKnowledgeOpenAI, GenereateImageUsingDallE2, GenereateAudioUsingTTS, parseFiles, ChatApp } from '../utils/llms';
  import { llms } from '../config';

  const app = express();

  app.get('/api/parsefiles', async (req: Request, res: Response) => {
    parseFiles();
    res.status(200).send("Execute finished, logs in the console or the log page");
    res.end();
  });
  
  app.post('/api/uploadfiles', uploadfiles().array('files', 10), async (req, res) => {
    uploadfilesInsertIntoDb(req.files as any[], req.body.knowledgeId, '999');
    res.json({"status":"ok", "msg":"Uploaded Success"}).end(); 
  });
  
  app.post('/api/DallE2Openai', async (req: Request, res: Response) => {
    const question: string = req.body.question
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
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
  
  app.post('/api/ChatOpenaiKnowledge', async (req: Request, res: Response) => {
    const { knowledgeId, question, history, appId } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          await chatKnowledgeOpenAI(res, checkUserTokenData.data.id, question, history, appId);
          res.end();
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
  
  app.post('/api/ChatOpenai', async (req: Request, res: Response) => {
    const { knowledgeId, question, history, template, appId, _id, publishId } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getLLMSSettingData = await getLLMSSetting(knowledgeId);
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          await chatChatOpenAI(_id, res, checkUserTokenData.data.id, question, history, template, appId, publishId || '', 1);
          res.end();
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

  app.post('/api/ChatApp', async (req: Request, res: Response) => {
    const { question, history, template, appId, _id, publishId, allowChatLog } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        await ChatApp(_id, res, checkUserTokenData.data.id, question, history, template, appId, publishId || '', allowChatLog);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
        res.end();
    }
  });

  app.post('/api/ChatAppAnonymous', async (req: Request, res: Response) => {
    const { question, history, template, appId, publishId, _id, allowChatLog } = req.body;
    const { authorization } = req.headers;
    if(authorization && authorization.length == 32) {
        await ChatApp(_id, res, authorization, question, history, template, appId, publishId || '', allowChatLog);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
        res.end();
    }
  });
  
  app.post('/api/ChatGemini', async (req: Request, res: Response) => {
    const { knowledgeId, question, history, template, appId, publishId, _id, allowChatLog} = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        await chatChatGemini(_id, res, checkUserTokenData.data.id, question, history, template, appId, publishId || '', allowChatLog);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/ChatBaiduwenxin', async (req: Request, res: Response) => {
    const { knowledgeId, question, history, template, appId } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const chatChatBaiduWenxinData: any = await chatChatBaiduWenxin(res, checkUserTokenData.data.id, question, history, template, appId);    
      res.status(200).json(chatChatBaiduWenxinData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/TTS-1', async (req: Request, res: Response) => {
    const question: string = req.body.question
    const voice: string = req.body.voice
    const appId: string = req.body.appId
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
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

  app.get('/api/audio/:file', async (req: Request, res: Response) => {
    const { file }= req.params;
    outputAudio(res, file);
  });

  app.get('/api/image/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputImage(res, file);

  });

  app.get('/api/avatarforapp/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputAvatarForApp(res, file);

  });

  app.get('/api/imageorigin/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputImageOrigin(res, file);
  });

  app.get('/api/llms', async (req: Request, res: Response) => {
    res.status(200).json(llms)
  });
  

  export default app;
