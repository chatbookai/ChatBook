// app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initChatBookDbExec } from './utils/db';
import { MenuListAdmin, MenuListUser } from './utils/const';
import { checkUserPassword, registerUser, changeUserPasswordByToken, changeUserDetail, changeUserStatus, checkUserToken, getUsers, getUserLogsAll, getUserLogs, getOneUserByToken } from './utils/user';
import { getLogsPage, getTemplate, getLLMSSetting, getFilesPage, getFilesKnowledgeId, getChatLogByKnowledgeIdAndUserId, addKnowledge, setOpenAISetting, setTemplate, getKnowledgePage, uploadfiles, uploadfilesInsertIntoDb, enableDir } from './utils/utils';
import { debug, outputImage, outputAudio, chatChatBaiduWenxin, chatChatGemini, chatChatOpenAI, chatKnowledgeOpenAI, GenereateImageUsingDallE2, GenereateAudioUsingTTS, parseFiles } from './utils/llms';


//Start Express Server
const app = express();
const port = 1988;
app.use(cors());
app.use(bodyParser.json());
dotenv.config();


//Initial Database and Folder
initChatBookDbExec()

//Schedule Task for Parse Upload Files
cron.schedule('*/3 * * * *', () => {
  console.log('Task Begin !');
  parseFiles();
  console.log('Task End !');
});


//Api Interface
app.post('/api/TTS-1', async (req: Request, res: Response) => {
  const question: string = req.body.question
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getLLMSSettingData = await getLLMSSetting("TTS-1");   
      if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
        const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", checkUserTokenData.data.id, question, 'alloy');
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

app.post('/api/settemplate', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const setTemplateData: any = await setTemplate({...req.body, userId: checkUserTokenData.data.id});
      res.status(200).json(setTemplateData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.post('/api/setopenai', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const setOpenAISettingData: any = await setOpenAISetting({...req.body, userId: checkUserTokenData.data.id});
      res.status(200).json(setOpenAISettingData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

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
        const GenereateImageUsingDallE2Data = await GenereateImageUsingDallE2(res, "Dall-E-2", checkUserTokenData.data.id, question, '1024x1024');
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
  const { knowledgeId, question, history } = req.body;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
      if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
        await chatKnowledgeOpenAI(res, knowledgeId, checkUserTokenData.data.id, question, history);
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
  const { knowledgeId, question, history } = req.body;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
      if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
        await chatChatOpenAI(res, knowledgeId, checkUserTokenData.data.id, question, history);
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

app.post('/api/ChatGemini', async (req: Request, res: Response) => {
  const { knowledgeId, question, history } = req.body;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
      if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
        await chatChatGemini(res, knowledgeId, checkUserTokenData.data.id, question, history);
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

app.post('/api/ChatBaiduwenxin', async (req: Request, res: Response) => {
  const { knowledgeId, question, history } = req.body;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
      if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
        const chatChatBaiduWenxinData: any = await chatChatBaiduWenxin(res, knowledgeId, checkUserTokenData.data.id, question, history);    
        res.status(200).json(chatChatBaiduWenxinData);
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

app.post('/api/addknowledge', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      console.log("checkUserTokenDatacheckUserTokenDatacheckUserTokenDatacheckUserTokenData", checkUserTokenData)
      const addKnowledgeData: any = await addKnowledge({...req.body, userId: checkUserTokenData.data.id});
      res.status(200).json(addKnowledgeData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/audio/:file', async (req: Request, res: Response) => {
  const { file }= req.params;
  outputAudio(res, file);
  res.end();
});

app.get('/api/chatlog/:knowledgeId/:userId/:pageid/:pagesize', async (req, res) => {
  const { knowledgeId, userId, pageid, pagesize } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const getChatLogByKnowledgeIdAndUserIdData: any = await getChatLogByKnowledgeIdAndUserId(knowledgeId, Number(userId), Number(pageid), Number(pagesize));
      res.status(200).json(getChatLogByKnowledgeIdAndUserIdData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/files/:pageid/:pagesize', async (req: Request, res: Response) => {
  const { pageid, pagesize } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getFilesPageData: any = await getFilesPage(Number(pageid), Number(pagesize));
      res.status(200).json(getFilesPageData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/files/:knowledgeId/:pageid/:pagesize', async (req: Request, res: Response) => {
  const { knowledgeId, pageid, pagesize } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getFilesPageData: any = await getFilesKnowledgeId(knowledgeId, Number(pageid), Number(pagesize));
      res.status(200).json(getFilesPageData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/getopenai/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getLLMSSettingData: any = await getLLMSSetting(id);
      res.status(200).json(getLLMSSettingData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/gettemplate/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getTemplateData: any = await getTemplate(id, checkUserTokenData.data.id);
      res.status(200).json(getTemplateData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/image/:file', async (req: Request, res: Response) => {
  const { file } = req.params;
  outputImage(res, file);
  res.end();
});

app.get('/api/knowledge/:pageid/:pagesize', async (req: Request, res: Response) => {
  const { pageid, pagesize } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const getKnowledgePageData: any = await getKnowledgePage(Number(pageid), Number(pagesize));
      res.status(200).json(getKnowledgePageData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/logs/:pageid/:pagesize', async (req: Request, res: Response) => {
  const { pageid, pagesize } = req.params;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getLogsPageData: any = await getLogsPage(Number(pageid), Number(pagesize));
      res.status(200).json(getLogsPageData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/menu/horizontal', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const MenuListAdminFilter = MenuListAdmin.filter( Item => Item && Item.title)
      res.status(200).json(MenuListAdminFilter);
  }
  else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
      res.status(200).json(MenuListUser);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.get('/api/menu/vertical', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      res.status(200).json(MenuListAdmin);
  }
  else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
      res.status(200).json(MenuListUser);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.post('/api/user/checktoken', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const checkUserTokenData = await checkUserToken(authorization as string);
  res.status(200).json(checkUserTokenData);
  res.end();
});

app.get('/api/user/getuserinfo', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const getOneUserByTokenData = await getOneUserByToken(authorization as string);
  res.status(200).json(getOneUserByTokenData);
  res.end();
});

app.post('/api/user/getuserlogs', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { pageid, pagesize } = req.body;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getUserLogsData = await getUserLogs(checkUserTokenData.data.email, Number(pageid), Number(pagesize));
      res.status(200).json(getUserLogsData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.post('/api/user/getuserlogsall', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { pageid, pagesize } = req.body;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getUserLogsAllData = await getUserLogsAll(Number(pageid), Number(pagesize));
      res.status(200).json(getUserLogsAllData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.post('/api/user/getusers', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { pageid, pagesize } = req.body;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
      const getUserLogsData = await getUsers(Number(pageid), Number(pagesize));
      res.status(200).json(getUserLogsData);
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  res.end();
});

app.post('/api/user/setuserstatus', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const changeUserStatusData = await changeUserStatus(authorization as string, req.body);
  res.status(200).json(changeUserStatusData);
  res.end();
});

app.post('/api/user/setuserinfo', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const changeUserDetailData = await changeUserDetail(authorization as string, req.body);
  res.status(200).json(changeUserDetailData);
  res.end();
});

app.post('/api/user/setpassword', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const changeUserPasswordByTokenData = await changeUserPasswordByToken(authorization as string, req.body);
  res.status(200).json(changeUserPasswordByTokenData);
  res.end();
});

app.post('/api/user/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const registerUserData = await registerUser(email, email, password, password, 'en');
  res.status(200).json(registerUserData);
  res.end();
});

app.post('/api/user/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const checkUserPasswordData = await checkUserPassword(req, email, password);
  res.status(200).json(checkUserPasswordData);
  res.end();
});

app.get('/api/debug', async (req: Request, res: Response) => {
  await debug(res, "ChatGPT4");
  res.end();
});

app.use(express.static(join(__dirname, '../../out')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
