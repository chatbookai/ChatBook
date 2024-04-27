
  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';
  import { addDataset, editDataset, deleteDataset, getDataset, addPublish, editPublish, deletePublish, getPublish, getCollectionPageByCollection, getCollectionAll } from '../utils/dataset';
 
  const app = express();

  app.post('/api/adddataset', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData adddataset", checkUserTokenData)
        const addDatasetData: any = await addDataset({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/editdataset', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData editdataset", checkUserTokenData)
        const editDatasetData: any = await editDataset({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/deletedataset', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData app", checkUserTokenData)
        const editDatasetData: any = await deleteDataset({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(editDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/getdataset/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenData app", checkUserTokenData)
        const getDatasetData: any = await getDataset(id, checkUserTokenData.data.id);
        res.status(200).json(getDatasetData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/collectionbyapp/:appId/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { appId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email) {
        const getCollectionPageData: any = await getCollectionPageByCollection(appId, Number(pageid), Number(pagesize), checkUserTokenData.data.id);
        res.status(200).json(getCollectionPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/collectionall/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getCollectionPageData: any = await getCollectionAll(Number(pageid), Number(pagesize));
        res.status(200).json(getCollectionPageData);
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

  export default app;
