  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken, checkUserTokenXWE, checkUserTokenXWENotCostAmount } from '../utils/user';

  import { getUserImages, getUserImagesAll, generateImageStabilityAi } from '../utils/getimg';

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

  export default app;
