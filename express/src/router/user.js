  // app.ts
  import express from 'express';

  import { checkUserPassword, registerUser, changeUserPasswordByToken, changeUserDetail, changeUserStatus, checkUserToken, getUsers, getUserLogsAll, getUserLogs, getOneUserByToken, getUserByEmail, updateUserImageFavorite, updateUserVideoFavorite, refreshUserToken, addUserAgent, deleteUserAgent, getUserAgents, getMyAgents, addUser, editUser, deleteUser } from '../utils/user.js';

  const app = express();

  app.post('/api/user/checktoken', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    res.status(200).json(checkUserTokenData);
    res.end();
  });

  app.post('/api/user/refreshtoken', async (req, res) => {
    const { authorization } = req.headers;
    const refreshUserTokenData = await refreshUserToken(authorization);
    res.status(200).json(refreshUserTokenData);
    res.end();
  });
  
  app.get('/api/user/getuserinfo', async (req, res) => {
    const { authorization } = req.headers;
    const getOneUserByTokenData = await getOneUserByToken(authorization);
    res.status(200).json(getOneUserByTokenData);
    res.end();
  });
  
  app.post('/api/user/getuserlogs', async (req, res) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getUserLogsData = await getUserLogs(checkUserTokenData.data.email, Number(pageid), Number(pagesize));
        res.status(200).json(getUserLogsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/user/getuserlogsall', async (req, res) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getUserLogsAllData = await getUserLogsAll(Number(pageid), Number(pagesize));
        res.status(200).json(getUserLogsAllData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/user/getusers', async (req, res) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getUserLogsData = await getUsers(Number(pageid), Number(pagesize), req.body);
        res.status(200).json(getUserLogsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/user/getuserbyid', async (req, res) => {
    const { authorization } = req.headers;
    const { email } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getUserLogsData = await getUserByEmail(email);
        res.status(200).json(getUserLogsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/user/setuserstatus', async (req, res) => {
    const { authorization } = req.headers;
    const changeUserStatusData = await changeUserStatus(authorization, req.body);
    res.status(200).json(changeUserStatusData);
    res.end();
  });

  app.post('/api/user/adduser', async (req, res) => {
    const { authorization } = req.headers;
    const addUserData = await addUser(authorization, req.body);
    res.status(200).json(addUserData);
    res.end();
  });

  app.post('/api/user/edituser', async (req, res) => {
    const { authorization } = req.headers;
    const editUserData = await editUser(authorization, req.body);
    res.status(200).json(editUserData);
    res.end();
  });

  app.post('/api/user/deleteuser', async (req, res) => {
    const { authorization } = req.headers;
    const deleteUserData = await deleteUser(authorization, req.body);
    res.status(200).json(deleteUserData);
    res.end();
  });
  
  app.post('/api/user/setuserinfo', async (req, res) => {
    const { authorization } = req.headers;
    const changeUserDetailData = await changeUserDetail(authorization, req.body);
    res.status(200).json(changeUserDetailData);
    res.end();
  });
  
  app.post('/api/user/setpassword', async (req, res) => {
    const { authorization } = req.headers;
    const changeUserPasswordByTokenData = await changeUserPasswordByToken(authorization, req.body);
    res.status(200).json(changeUserPasswordByTokenData);
    res.end();
  });
  
  app.post('/api/user/register', async (req, res) => {
    const { email, password } = req.body;
    const registerUserData = await registerUser(email, email, password, password, 'en');
    res.status(200).json(registerUserData);
    res.end();
  });
  
  app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;
    const checkUserPasswordData = await checkUserPassword(req, email, password);
    res.status(200).json(checkUserPasswordData);
    res.end();
  });

  app.post('/api/user/image/favorite', async (req, res) => {
    const { authorization } = req.headers;
    const updateUserImageFavoriteData = await updateUserImageFavorite(authorization, req.body);
    res.status(200).json(updateUserImageFavoriteData);
    res.end();
  });

  app.post('/api/user/video/favorite', async (req, res) => {
    const { authorization } = req.headers;
    const updateUserVideoFavoriteData = await updateUserVideoFavorite(authorization, req.body);
    res.status(200).json(updateUserVideoFavoriteData);
    res.end();
  });

  app.post('/api/user/agent/add', async (req, res) => {
    const { authorization } = req.headers;
    const addUserAgentData = await addUserAgent(authorization, req.body);
    res.status(200).json(addUserAgentData);
    res.end();
  });

  app.post('/api/user/agent/delete', async (req, res) => {
    const { authorization } = req.headers;
    const deleteUserAgentData = await deleteUserAgent(authorization, req.body);
    res.status(200).json(deleteUserAgentData);
    res.end();
  });

  app.post('/api/user/agents', async (req, res) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getUserAgentsData = await getUserAgents(checkUserTokenData.data.id, Number(pageid), Number(pagesize));
        res.status(200).json(getUserAgentsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/my/agents', async (req, res) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getMyAgentsData = await getMyAgents(checkUserTokenData.data.id, Number(pageid), Number(pagesize));
        res.status(200).json(getMyAgentsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  

  export default app;
