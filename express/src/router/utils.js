
  // app.ts
  import express from 'express';

  import { MenuListAdmin, MenuListUser } from '../utils/const.js';
  import { checkUserToken } from '../utils/user.js';
  import { getLogsPage, clearShortLogs, clearAllLogs, getTemplate, getLLMSSetting, getFilesPage, getFilesDatasetId, getChatLogByKnowledgeIdAndUserId, addKnowledge, setOpenAISetting, setTemplate, getKnowledgePage, wholeSiteStatics, getAllImages, deleteUserLogByKnowledgeId, getAgentsPage, getAgentsEnabledList, addAgent, editAgent } from '../utils/utils.js';

  const app = express();

  app.post('/api/settemplate', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const setTemplateData = await setTemplate({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(setTemplateData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/setopenai', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const setOpenAISettingData = await setOpenAISetting({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(setOpenAISettingData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/addknowledge', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenDatacheckUserTokenDatacheckUserTokenDatacheckUserTokenData", checkUserTokenData)
        const addKnowledgeData = await addKnowledge({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addKnowledgeData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/chatlog/agent/:datasetId/:userId/:pageid/:pagesize', async (req, res) => {
    const { datasetId, userId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getChatLogByKnowledgeIdAndUserIdData = await getChatLogByKnowledgeIdAndUserId(datasetId, Number(userId), Number(pageid), Number(pagesize));
        res.status(200).json(getChatLogByKnowledgeIdAndUserIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/chatlog/clear/:userId/:datasetId', async (req, res) => {
    const { userId, datasetId } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const deleteUserLogByKnowledgeIdData = await deleteUserLogByKnowledgeId(datasetId, Number(userId));
        res.status(200).json(deleteUserLogByKnowledgeIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/files/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getFilesPageData = await getFilesPage(Number(pageid), Number(pagesize));
        res.status(200).json(getFilesPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/files/:datasetId/:pageid/:pagesize', async (req, res) => {
    const { datasetId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getFilesPageData = await getFilesDatasetId(datasetId, Number(pageid), Number(pagesize));
        res.status(200).json(getFilesPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/getopenai/:id', async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData = await getLLMSSetting(id);
        res.status(200).json(getLLMSSettingData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/gettemplate/:id', async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getTemplateData = await getTemplate(id, checkUserTokenData.data.id);
        res.status(200).json(getTemplateData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/knowledge/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getKnowledgePageData = await getKnowledgePage(Number(pageid), Number(pagesize));
        res.status(200).json(getKnowledgePageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/logs/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLogsPageData = await getLogsPage(Number(pageid), Number(pagesize));
        res.status(200).json(getLogsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/logs/clearshortlogs', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const clearShortLogsData = await clearShortLogs();
        res.status(200).json(clearShortLogsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/logs/clearalllogs', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const clearAllLogsData = await clearAllLogs();
        res.status(200).json(clearAllLogsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/menu/horizontal', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const MenuListAdminFilter = MenuListAdmin.filter( Item => Item && Item.title)
        res.status(200).json(MenuListAdminFilter);
    }
    else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
        res.status(200).json(MenuListUser);
    }
    else {
        res.status(200).json(MenuListUser);
    }
    res.end();
  });
  
  app.get('/api/menu/vertical', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        res.status(200).json(MenuListAdmin);
    }
    else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
        res.status(200).json(MenuListUser);
    }
    else {
        res.status(200).json(MenuListUser);
    }
    res.end();
  });

  app.get('/api/static/site', async (req, res) => {
    const wholeSiteStaticsData = await wholeSiteStatics();
    res.status(200).json(wholeSiteStaticsData).end();
  });

  app.post('/api/getAllImages', async (req, res) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    const generateimageData = await getAllImages(checkUserTokenData?.data?.id, pageid, pagesize);
    //console.log("generateimageData", generateimageData);
    res.status(200).json(generateimageData).end();
  });

  app.get('/api/agentsall/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin')) {
        const getAgentsPageData = await getAgentsPage(Number(pageid), Number(pagesize));
        res.status(200).json(getAgentsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/agents/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const { type, search } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getAgentsPageData = await getAgentsEnabledList(Number(pageid), Number(pagesize), type, search);
        res.status(200).json(getAgentsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/addagent', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData addagent", checkUserTokenData)
        const addAgentData = await addAgent({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addAgentData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editagent', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData editagent", checkUserTokenData)
        const editAgentData = await editAgent({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editAgentData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deleteagent', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData deleteagent", checkUserTokenData)
        const editAgentData = await editAgent({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editAgentData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  export default app;
