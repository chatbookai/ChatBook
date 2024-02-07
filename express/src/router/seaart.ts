  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken, checkUserTokenXWE, checkUserTokenXWENotCostAmount } from '../utils/user';

  import { getUserImagesSeaArt, getUserImagesAll, getUserVideosStabilityAi, getUserVideosStabilityAiAll, generateImageSeaArt, generateVideoSeaArt, getVideoSeaArt, outputVideo, outputVideoImage } from '../utils/seaart';

  import { uploadimageforvideo } from '../utils/utils';

  const app = express();

  app.post('/api/getUserImagesSeaArt', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateimageData = await getUserImagesSeaArt(checkUserTokenData.data.id, pageid, pagesize);
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

  app.post('/api/generateImageSeaArt', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageSeaArtData = await generateImageSeaArt(checkUserTokenData, req.body);
      console.log("generateImageSeaArtData", generateImageSeaArtData);
      res.status(200).json(generateImageSeaArtData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateImageSeaArtXWE', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserTokenXWE(authorization as string);
    console.log("checkUserTokenData", checkUserTokenData)
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageSeaArtData = await generateImageSeaArt(checkUserTokenData, req.body);
      console.log("generateImageSeaArtData", generateImageSeaArtData);
      res.status(200).json(generateImageSeaArtData).end();
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
      const generateimageData = await getUserImagesSeaArt(checkUserTokenData.data.id, pageid, pagesize);
      console.log("generateimageData", generateimageData);
      res.status(200).json(generateimageData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateVideoSeaArt', uploadimageforvideo().array('image', 10), async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateVideoSeaArtData = await generateVideoSeaArt(checkUserTokenData, req.body, req.files);
      console.log("generateVideoSeaArtData", generateVideoSeaArtData);
      res.status(200).json(generateVideoSeaArtData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid in generateVideoSeaArt", "data": checkUserTokenData}).end();
    }
  });

  app.get('/api/getVideoSeaArt', async (req: Request, res: Response) => {
    const id = "b8a57ec51f4cf5fb5e98f82e6b6efcd118651797fc90fdb8ef662d25625d5fff"
    const getVideoSeaArtData = await getVideoSeaArt(id);
    //console.log("generateVideoSeaArtData", getVideoSeaArtData);
    res.status(200).send(getVideoSeaArtData).end();
  });

  app.post('/api/getUserVideosStabilityAi', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const getUserVideosStabilityAiData = await getUserVideosStabilityAi(checkUserTokenData.data.id, pageid, pagesize);
      //console.log("getUserVideosStabilityAiData", getUserVideosStabilityAiData);
      res.status(200).json(getUserVideosStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserVideosStabilityAiAll', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const getUserVideosStabilityAiAllData = await getUserVideosStabilityAiAll(pageid, pagesize);
    //console.log("getUserVideosStabilityAiAllData", getUserVideosStabilityAiAllData);
    res.status(200).json(getUserVideosStabilityAiAllData).end();
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
