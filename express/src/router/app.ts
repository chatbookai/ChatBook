  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';
  import { addApp, editApp, deleteApp, getApp, getAppPage, addPublish, editPublish, deletePublish, getPublish, getPublishsPageByApp, getPublishsAll, getChatlogPageByApp, getChatLogByAppIdAndUserId, deleteUserLogByAppId, deleteUserLogByChatlogId } from '../utils/app';
  import { getLLMSSetting } from '../utils/utils';
  import { GenereateAudioUsingTTS } from '../utils/llms';
 
  const app = express();

  app.post('/api/addapp', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData addapp", checkUserTokenData)
        const addAppData: any = await addApp({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editapp', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData editapp", checkUserTokenData)
        const editAppData: any = await editApp({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deleteapp', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData app", checkUserTokenData)
        const editAppData: any = await deleteApp({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/getapp/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData app", checkUserTokenData)
        const getAppData: any = await getApp(id, checkUserTokenData.data.id);
        res.status(200).json(getAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/getapppage/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getChatlogPageData: any = await getAppPage(Number(pageid), Number(pagesize), checkUserTokenData.data.id);
        res.status(200).json(getChatlogPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  
  app.get('/api/chatlogbyapp/:appId/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { appId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getChatlogPageData: any = await getChatlogPageByApp(appId, Number(pageid), Number(pagesize), checkUserTokenData.data.id);
        res.status(200).json(getChatlogPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/publishsbyapp/:appId/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { appId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getPublishsPageData: any = await getPublishsPageByApp(appId, Number(pageid), Number(pagesize), checkUserTokenData.data.id);
        res.status(200).json(getPublishsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/publishsall/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getPublishsPageData: any = await getPublishsAll(Number(pageid), Number(pagesize));
        res.status(200).json(getPublishsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/addpublish', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData addpublish", checkUserTokenData)
        const addPublishData: any = await addPublish({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addPublishData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editpublish', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData editpublish", checkUserTokenData)
        const editPublishData: any = await editPublish({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editPublishData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deletepublish', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData deletepublish", checkUserTokenData)
        const deletePublishData: any = await deletePublish({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(deletePublishData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/app/chatlog/:appId/:pageid/:pagesize', async (req, res) => {
    const { appId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getChatLogByAppIdAndUserIdData: any = await getChatLogByAppIdAndUserId(appId, Number(checkUserTokenData.data.id), Number(pageid), Number(pagesize));
        res.status(200).json(getChatLogByAppIdAndUserIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/app/chatlog/clear', async (req, res) => {
    const { appId } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const deleteUserLogByappIdData: any = await deleteUserLogByAppId(appId, Number(checkUserTokenData.data.id));
        res.status(200).json(deleteUserLogByappIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/app/chatlog/delete', async (req, res) => {
    const { appId, chatlogId } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const deleteUserLogByappIdData: any = await deleteUserLogByChatlogId(appId, Number(checkUserTokenData.data.id), chatlogId);
        res.status(200).json(deleteUserLogByappIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/app/audio', async (req: Request, res: Response) => {
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



  export default app;
