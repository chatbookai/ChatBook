
  // app.ts
  import express from 'express';

  import { checkUserToken } from '../utils/user.js';
  import { addDataset, editDataset, deleteDataset, getDataset, getDatasetPage, addCollection, editCollection, uploadCollection, deleteCollection, getCollection, getCollectionPageByDataset, getCollectionAll } from '../utils/dataset.js';
  import { uploadAvatarForDataset } from '../utils/utils.js';
 
  const app = express();

  app.post('/api/adddataset', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData adddataset", checkUserTokenData)
        const addDatasetData = await addDataset({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editdataset', uploadAvatarForDataset().array('avatar', 1), async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("editdataset uploadedFiles", req.files)
        if(req.files && Array.isArray(req.files) && req.files[0] && req.files[0].filename) {
          req.body.avatar = req.files[0].filename
        }
        console.log("editdataset originalAvatar", req.body.avatar)
        const editDatasetData = await editDataset({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deletedataset', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData app", checkUserTokenData)
        const editDatasetData = await deleteDataset({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/getdataset/:id', async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData app", checkUserTokenData)
        const getDatasetData = await getDataset(id, checkUserTokenData.data.id);
        res.status(200).json(getDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/getdatasetpage/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const { type, search } = req.body;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getCollectionPageData = await getDatasetPage(Number(pageid), Number(pagesize), checkUserTokenData.data.id);
        res.status(200).json(getCollectionPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/collectionbydataset/:datasetId/:pageid/:pagesize', async (req, res) => {
    const { datasetId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getCollectionPageData = await getCollectionPageByDataset(datasetId, Number(pageid), Number(pagesize), checkUserTokenData.data.id);
        res.status(200).json(getCollectionPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/collectionall/:pageid/:pagesize', async (req, res) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getCollectionPageData = await getCollectionAll(Number(pageid), Number(pagesize));
        res.status(200).json(getCollectionPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/addcollection', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData addcollection", checkUserTokenData)
        const addCollectionData = await addCollection({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addCollectionData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editcollection', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData editcollection", checkUserTokenData)
        const editCollectionData = await editCollection({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editCollectionData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deletecollection', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData deletecollection", checkUserTokenData)
        const deleteCollectionData = await deleteCollection({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(deleteCollectionData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/uploadcollection', async (req, res) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        //console.log("checkUserTokenData uploadCollectionData", checkUserTokenData)
        const uploadCollectionData = await uploadCollection({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(uploadCollectionData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  export default app;
