  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken, checkUserTokenXWE, checkUserTokenXWENotCostAmount } from '../utils/user';

  import { getUserImages, getUserImagesAll, getUserVideos, getUserVideosAll, generateImageStabilityAi, generateVideoStabilityAi, getVideoStabilityAi, outputVideo, outputVideoImage } from '../utils/getimg';

  import { uploadimageforvideo } from '../utils/utils';

  const app = express();

  app.post('/api/getUserImages', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateimageData = await getUserImages(checkUserTokenData.data.id, pageid, pagesize);
      console.log("generateimageData", generateimageData);
      res.status(200).json(generateimageData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserImagesAll', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const getUserImagesAllData = await getUserImagesAll(pageid, pagesize);
    console.log("getUserImagesAllData", getUserImagesAllData);
    res.status(200).json(getUserImagesAllData).end();
  });

  app.post('/api/generateImageStabilityAi', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageStabilityAiData = await generateImageStabilityAi(checkUserTokenData, req.body);
      console.log("generateImageStabilityAiData", generateImageStabilityAiData);
      res.status(200).json(generateImageStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateImageStabilityAiXWE', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserTokenXWE(authorization as string);
    console.log("checkUserTokenData", checkUserTokenData)
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageStabilityAiData = await generateImageStabilityAi(checkUserTokenData, req.body);
      console.log("generateImageStabilityAiData", generateImageStabilityAiData);
      res.status(200).json(generateImageStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserImagesXWE', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserTokenXWENotCostAmount(authorization as string);
    console.log("checkUserTokenData", checkUserTokenData)
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateimageData = await getUserImages(checkUserTokenData.data.id, pageid, pagesize);
      console.log("generateimageData", generateimageData);
      res.status(200).json(generateimageData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateVideoStabilityAi', uploadimageforvideo().array('image', 10), async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateVideoStabilityAiData = await generateVideoStabilityAi(checkUserTokenData, req.body, req.files);
      console.log("generateVideoStabilityAiData", generateVideoStabilityAiData);
      res.status(200).json(generateVideoStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid in generateVideoStabilityAi", "data": checkUserTokenData}).end();
    }
  });

  app.get('/api/getVideoStabilityAi', async (req: Request, res: Response) => {
    const id = "b8a57ec51f4cf5fb5e98f82e6b6efcd118651797fc90fdb8ef662d25625d5fff"
    const getVideoStabilityAiData = await getVideoStabilityAi(id);
    //console.log("generateVideoStabilityAiData", getVideoStabilityAiData);
    res.status(200).send(getVideoStabilityAiData).end();
  });

  app.post('/api/getUserVideos', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const getUserVideosData = await getUserVideos(checkUserTokenData.data.id, pageid, pagesize);
      //console.log("getUserVideosData", getUserVideosData);
      res.status(200).json(getUserVideosData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserVideosAll', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const getUserVideosAllData = await getUserVideosAll(pageid, pagesize);
    //console.log("getUserVideosAllData", getUserVideosAllData);
    res.status(200).json(getUserVideosAllData).end();
  });

  app.get('/api/video/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputVideo(res, file);
  });

  app.get('/api/videoimage/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputVideoImage(res, file);
  });

  

  export default app;
