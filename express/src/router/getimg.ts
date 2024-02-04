  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';

  import { getModels, getModelDetail, generateimage, getModelsToGenereateImage, TextToImageALL, TextToImageAllLatentConsistency, Base64ToImg, getUserImages } from '../utils/getimg';

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

  app.get('/api/getModelsToGenereateImage', async (req: Request, res: Response) => {
    const getModelsToGenereateImageData = await getModelsToGenereateImage();
    //console.log("getModelsToGenereateImageData", getModelsToGenereateImageData)
    res.status(200).json(getModelsToGenereateImageData).end();
  });

  app.get('/api/getModelDetail/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const getModelDetailData = await getModelDetail(id);
    console.log("getModelDetailData", getModelDetailData)
    res.status(200).json(getModelDetailData).end();
  });

  app.get('/api/TextToImageALL', async (req: Request, res: Response) => {
    const TextToImageALLData = await TextToImageALL();
    console.log("TextToImageALLData", TextToImageALLData);
    let TextToImageALLDataHtml = '';
    TextToImageALLData.map((FileName: string)=>{
        if(FileName) {
            TextToImageALLDataHtml += "<img src='/api/image/"+FileName+"' border=0 width=600>";
        }
    })
    res.status(200).send(TextToImageALLDataHtml).end();
  });

  app.get('/api/TextToImageAllLatentConsistency', async (req: Request, res: Response) => {
    const TextToImageAllLatentConsistencyData = await TextToImageAllLatentConsistency();
    console.log("TextToImageAllLatentConsistencyData", TextToImageAllLatentConsistencyData);
    let TextToImageAllLatentConsistencyDataHtml = '';
    TextToImageAllLatentConsistencyData.map((FileName: string)=>{
        if(FileName) {
            TextToImageAllLatentConsistencyDataHtml += "<img src='/api/image/"+FileName+"' border=0 width=600>";
        }
    })
    res.status(200).send(TextToImageAllLatentConsistencyDataHtml).end();
  });

  app.get('/api/Base64ToImg', async (req: Request, res: Response) => {
    const Base64IMG = ""
    const Base64ToImgData = await Base64ToImg(Base64IMG, 'absolute-reality-v1-8-1');
    console.log("Base64ToImgData", Base64ToImgData)
    res.status(200).json(Base64ToImgData).end();
  });

  app.post('/api/generateimage', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateimageData = await generateimage(checkUserTokenData, req.body);
      console.log("generateimageData", generateimageData);
      res.status(200).json(generateimageData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

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



  
  export default app;
