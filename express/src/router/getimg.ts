  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';

  import { getModels, getModelDetail, TextToImageBySD, Base64ToImg } from '../utils/getimg';

  const app = express();

  app.get('/api/getModels', async (req: Request, res: Response) => {
    const getModelsData = await getModels();
    console.log("getModels", getModelsData)
    res.status(200).json(getModelsData).end();
    /*
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        res.status(200).json({});
    }
    else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
        res.status(200).json({});
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
    */
  });

  app.get('/api/getModelDetail/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const getModelDetailData = await getModelDetail(id);
    console.log("getModelDetailData", getModelDetailData)
    res.status(200).json(getModelDetailData).end();
  });

  app.get('/api/TextToImageBySD', async (req: Request, res: Response) => {
    const TextToImageBySDData = await TextToImageBySD("id");
    console.log("TextToImageBySDData", TextToImageBySDData)
    res.status(200).json(TextToImageBySDData).end();
  });

  app.get('/api/Base64ToImg', async (req: Request, res: Response) => {
    const Base64IMG = ""
    const Base64ToImgData = await Base64ToImg(Base64IMG);
    console.log("Base64ToImgData", Base64ToImgData)
    res.status(200).json(Base64ToImgData).end();
  });

  

  export default app;
