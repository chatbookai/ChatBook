  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';
  import { addApp, editApp, editAppById, deleteApp, deleteAppById, getApp, getAppById, getAppPage, getAppPageAll, addPublish, editPublish, deletePublish, getPublish, getPublishsPageByApp, getPublishsAll, getChatlogPageByApp, getChatLogByAppIdAndUserId, deleteUserLogByAppId, deleteUserLogByChatlogId, getAppByPublishId, getChatlogStaticPageByApp } from '../utils/app';
  import { getLLMSSetting, uploadavatar } from '../utils/utils';
  import { GenereateAudioUsingTTS } from '../utils/llms';
 
  const app = express();

  app.post('/api/addapp', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData addapp", checkUserTokenData)
        const addAppData: any = await addApp({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editapp', uploadavatar().array('avatar', 1),  async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("editapp uploadedFiles", req.files)
        let originalAvatar = req.body.avatar
        if(req.files && Array.isArray(req.files) && req.files[0] && req.files[0].filename) {
          originalAvatar = req.files[0].filename
        }
        const editAppData: any = await editApp({...req.body, userId: checkUserTokenData.data.id, avatar: originalAvatar});
        res.status(200).json(editAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editappbyid', uploadavatar().array('avatar', 1),  async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin')) {
        let originalAvatar = req.body.avatar
        if(req.files && Array.isArray(req.files) && req.files[0] && req.files[0].filename) {
          originalAvatar = req.files[0].filename
        }
        const editAppData: any = await editAppById({...req.body, userId: checkUserTokenData.data.id, avatar: originalAvatar});
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
        //console.log("checkUserTokenData app", checkUserTokenData)
        const editAppData: any = await deleteApp({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deleteappbyid', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { _id, id } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin') && _id && id) {
        //console.log("checkUserTokenData app", checkUserTokenData)
        const editAppData: any = await deleteAppById({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/getapp', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') && req.body.appId) {
        //console.log("checkUserTokenData app", checkUserTokenData)
        const getAppData: any = await getApp(req.body.appId, checkUserTokenData.data.id);
        res.status(200).json(getAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/getappbyid', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin') && req.body.appId && req.body.id) {
        //console.log("checkUserTokenData app", checkUserTokenData)
        const getAppData: any = await getAppById(req.body.appId, req.body.id);
        res.status(200).json(getAppData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/getappbypublishid', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { publishId, userType } = req.body;
    let userId = null
    if(userType == "User")   {
      const checkUserTokenData: any = await checkUserToken(authorization as string);
      if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        userId = checkUserTokenData.data.id
      }
    }
    else {
      if(authorization && authorization.length == 32) {
        userId = authorization
      }
    }
    if(userId != null && publishId) {
      const getAppData: any = await getAppByPublishId(publishId);
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

  app.post('/api/getapppageall/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getChatlogPageData: any = await getAppPageAll(Number(pageid), Number(pagesize), req.body);
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

  app.get('/api/chatlogstaticbyapp/:appId/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { appId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getChatlogPageData: any = await getChatlogStaticPageByApp(appId, Number(pageid), Number(pagesize));
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
        //console.log("checkUserTokenData addpublish", checkUserTokenData)
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
        //console.log("checkUserTokenData editpublish", checkUserTokenData)
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
        //console.log("checkUserTokenData deletepublish", checkUserTokenData)
        const deletePublishData: any = await deletePublish({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(deletePublishData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/app/chatlog/:appId/:pageid/:pagesize', async (req, res) => {
    const { appId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const { userType } = req.body;
    let userId = null
    if(userType == "User")   {
      const checkUserTokenData: any = await checkUserToken(authorization as string);
      if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        userId = checkUserTokenData.data.id
      }
    }
    else {
      if(authorization && authorization.length == 32) {
        userId = authorization
      }
    }
    if(userId != null) {
        const getChatLogByAppIdAndUserIdData: any = await getChatLogByAppIdAndUserId(appId, userId, Number(pageid), Number(pagesize));
        res.status(200).json(getChatLogByAppIdAndUserIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/app/chatlog/clear', async (req, res) => {
    const { appId, userType } = req.body;
    const { authorization } = req.headers;
    let userId = null
    if(userType == "User")   {
      const checkUserTokenData: any = await checkUserToken(authorization as string);
      if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        userId = checkUserTokenData.data.id
      }
    }
    else {
      if(authorization && authorization.length == 32) {
        userId = authorization
      }
    }
    if(userId != null) {
        const deleteUserLogByappIdData: any = await deleteUserLogByAppId(appId, userId);
        res.status(200).json(deleteUserLogByappIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/app/chatlog/delete', async (req, res) => {
    const { appId, chatlogId, userType } = req.body;
    const { authorization } = req.headers;
    let userId = null
    if(userType == "User")   {
      const checkUserTokenData: any = await checkUserToken(authorization as string);
      if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        userId = checkUserTokenData.data.id
      }
    }
    else {
      if(authorization && authorization.length == 32) {
        userId = authorization
      }
    }
    if(userId != null) {
      const deleteUserLogByappIdData: any = await deleteUserLogByChatlogId(appId, userId, chatlogId);
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
    const userType: string = req.body.userType
    const { authorization } = req.headers;
    let userId = null
    if(userType == "User")   {
      const checkUserTokenData: any = await checkUserToken(authorization as string);
      if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        userId = checkUserTokenData.data.id
      }
    }
    else {
      if(authorization && authorization.length == 32) {
        userId = authorization
      }
    }
    if(userId != null) {
        const getLLMSSettingData = await getLLMSSetting("TTS-1");   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", userId, question, voice, appId);
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
