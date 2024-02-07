import { Request, Response } from 'express';
import axios from 'axios'
import * as fs from 'fs'
import { DataDir } from './const'

import path from 'path'
import { db, getDbRecord, getDbRecordALL } from './db'
import { timestampToDate, isFile } from './utils'
import FormData from "form-data"

const GETIMG_AI_SECRET_KEY_IMAGE = process.env.STABILITY_API_KEY_IMAGE
const GETIMG_AI_SECRET_KEY_VIDEO = process.env.STABILITY_API_KEY_VIDEO

type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;


interface StabilityAi {
  model: string
  prompt: string
  negativePrompt: string
  width: number
  height: number
  steps: number
  CFGScale: number
  numberOfImages: number
  style: string
  outpuFormat: string
  seed: number | string
}

export async function generateImageStabilityAi(checkUserTokenData: any, data: StabilityAi) {
  //return "realistic-vision-v5-1-1706996772820-667074977";
  let url = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";
  data.width = 512
  data.height = 512
  if(data.model == "stable-diffusion-xl-1024-v1-0") {
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
    data.width = 1024
    data.height = 1024
  }

  const POSTDATA: any = {}
  POSTDATA['steps'] = Number(data.steps)
  POSTDATA['width'] = Number(data.width)
  POSTDATA['height'] = Number(data.height)
  const seed = data.seed && data.seed !='' ? data.seed : Math.floor( Math.random() * 1000000)
  POSTDATA['seed'] = Math.floor(Number(seed))
  POSTDATA['cfg_scale'] = data.CFGScale ?? 5
  POSTDATA['samples'] = 1
  POSTDATA['style_preset'] = data.style ?? "digital-art"
  POSTDATA['text_prompts'] = [{text: data.prompt, weight: 1},{text: data.negativePrompt, weight: -1}]

  console.log("POSTDATA", POSTDATA)

  try {
    const res = await axios.post(url, JSON.stringify(POSTDATA), {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY_IMAGE}`,
        },
      });
    console.log("res.data", res.data)
    if(res.status == 200 && res.data) {
        let FileNamePath = ''
        res.data.artifacts.forEach((image: any, index: number) => {          
          FileNamePath = Base64ToImg(image.base64, 'v16_' + image.seed);
        })     
        console.log("FileNamePath", FileNamePath)
        const cost_api = 0.005   
        const cost_usd = 0.01  
        const cost_xwe = 0    
        const orderTX = ''
        const orderId = FileNamePath
        try {
          const insertSetting = db.prepare('INSERT INTO userimages (userId, email, model, `prompt`, negative_prompt, steps, seed, style, filename, data, `date`, createtime, cost_usd, cost_xwe, cost_api, orderId, orderTX, source ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
          insertSetting.run(checkUserTokenData.data.id, checkUserTokenData.data.email, data.model, data.prompt, data.negativePrompt, data.steps, POSTDATA['seed'], POSTDATA['style_preset'], orderId, JSON.stringify(POSTDATA), timestampToDate(Date.now()/1000), Date.now(), cost_usd, cost_xwe, cost_api, orderId, orderTX, 'stability.ai');
          insertSetting.finalize();
        }
        catch(error: any) {
          console.log("generateImageStabilityAiV16 insertSetting Error", error.message)
        }
        return orderId;
    }
    else {
        return null;
    }
  }
  catch(error: any) {
    console.log("generateImageStabilityAiV16 Error", error.message)
    return null;
  }
  
}

export function Base64ToImg(Base64IMG: string, model: string) {
    const decodedImg = Buffer.from(Base64IMG, 'base64');
    const uniqueSuffix = model + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
    const FileName = DataDir + "/image/" +uniqueSuffix + '.png';
    fs.writeFileSync(FileName, decodedImg);
    return uniqueSuffix;
}

export async function getUserImages(userId: string, pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userimages where userId = ? ", [userId]);
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT id, userId, email, model, `prompt`, negative_prompt, steps, style, filename, data, `date`, createtime FROM userimages where userId = ? ORDER BY id DESC LIMIT ? OFFSET ? ', [userId, pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getUserImagesAll(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from userimages where 1=1 ");
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT id, userId, email, model, `prompt`, negative_prompt, steps, style, filename, data, `date`, createtime FROM userimages where 1=1 ORDER BY id DESC LIMIT ? OFFSET ? ', [pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function generateVideoStabilityAi(checkUserTokenData: any, PostData:any, files: any) {
  if(files==null || files[0]==null || files[0].filename==null) {
    return {status: 'error', statusText: 'Please upload the file first' };
  }
  const FileName = files[0].filename
  const FilePath = files[0].path
  console.log("files", files)
  const data: any = new FormData();
  data.append("image", fs.readFileSync(FilePath), FileName);
  data.append("seed", Number(PostData.seed));
  data.append("cfg_scale", Number(PostData.cfg_scale));
  data.append("motion_bucket_id", Number(PostData.motion_bucket_id));

  try {
    const res = await axios.request({
      url: `https://api.stability.ai/v2alpha/generation/image-to-video`,
      method: "post",
      validateStatus: undefined,
      headers: {
        'authorization': `Bearer ${GETIMG_AI_SECRET_KEY_VIDEO}`,
        ...data.getHeaders(),
      },
      data: data,
    });
    console.log("res.data************************", res.data)
    if(res.status == 200 && res.data && res.data.id) {
        const cost_api = 0.025   
        const cost_usd = 0.05  
        const cost_xwe = 0    
        const orderTX = res.data.id
        const orderId = res.data.id
        try {
          const insertSetting = db.prepare('INSERT INTO uservideos (userId, email, model, motion, cfg_scale, seed, filename, data, `date`, createtime, cost_usd, cost_xwe, cost_api, orderId, orderTX, source ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
          insertSetting.run(checkUserTokenData.data.id, checkUserTokenData.data.email, 'stability.ai', PostData.motion_bucket_id, PostData.cfg_scale, PostData.seed, FileName.replace(".png","").replace(".jpg","").replace(".jpeg",""), JSON.stringify(PostData), timestampToDate(Date.now()/1000), Date.now(), cost_usd, cost_xwe, cost_api, orderId, orderTX, 'stability.ai');
          insertSetting.finalize();
        }
        catch(error: any) {
          console.log("generateVideoStabilityAi insertSetting Error", error)
        }
        
        return {status: 'ok', statusText: 'It has been submitted to the queue and the video will be generated in a few minutes.', id: orderId};
    }
    else {
      return {status: 'error', statusText: 'Submit failed', errorText: res.data.toString() };
    }
  }
  catch(error: any) {
    console.log("generateVideoStabilityAi Error", error.message)
    return {status: 'error', statusText: 'Submit failed', errorText: error.message };
  }
  
}

export async function getVideoStabilityAi(generationID: string) {

  const response = await axios.request({
    url: `https://api.stability.ai/v2alpha/generation/image-to-video/result/${generationID}`,
    method: "GET",
    validateStatus: undefined,
    responseType: "arraybuffer",
    headers: {
      accept: "video/*", // Use 'application/json' to receive base64 encoded JSON
      authorization: `Bearer ${GETIMG_AI_SECRET_KEY_VIDEO}`,
    },
  });
  
  if (response.status === 202) {
    console.log("Generation is still running, try again in 10 seconds.");

    return false 
  } else if (response.status === 200) {
    console.log("Generation is complete!");
    fs.writeFileSync(DataDir + '/video/' + generationID + ".mp4", Buffer.from(response.data));

    return true 
  } else if (response.status === 404) {
    console.log(`Response ${response.status}: ${response.data.toString()}`);

    return false
  } else {
    console.log(`Response ${response.status}: ${response.data.toString()}`);

    return false
  } 
}

export async function downloadVideoFromAPI() {
  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT id, filename, orderId FROM uservideos where status = 0 order by id desc LIMIT 10 OFFSET 0 ') || [];
  if(RecordsAll != undefined) {
    await Promise.all(
      RecordsAll.map(async (Item: any)=>{
          console.log("downloadVideoFromAPI Item", Item.id, Item.orderId)
          const getVideoStabilityAiData = await getVideoStabilityAi(Item.orderId);
          if(getVideoStabilityAiData) {
            const updateSetting = db.prepare('update uservideos set status = ? where id = ?');
            updateSetting.run(1, Item.id);
            updateSetting.finalize();
            console.log("Download Video Success ", Item.id, Item.orderId)
          }
        })
    );
  }
}

export async function getUserVideosStabilityAi(userId: string, pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from uservideos where userId = ? ", [userId]);
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT * FROM uservideos where userId = ? ORDER BY id DESC LIMIT ? OFFSET ? ', [userId, pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getUserVideosStabilityAiAll(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from uservideos where 1=1 ");
  const RecordsTotal: number = Records ? Records.NUM : 0;

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT * FROM uservideos where 1=1 ORDER BY id DESC LIMIT ? OFFSET ? ', [pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function outputVideo(res: Response, file: string) {
  try {
    const FileName = path.join(DataDir, "/video/"+ file + ".mp4");
    if(isFile(FileName))   {
      const readStream = fs.createReadStream(FileName);
      res.setHeader('Content-Type', 'video/mp4');
      readStream.pipe(res);
      console.log("FileName Exist: ", FileName)
    }
    else {
      res.status(200).json({ error: 'File not exist', FileName: FileName })
    }
  } 
  catch (error) {
      console.error('outputVideo Error:', error);
      res.status(200).json({ error: 'File not exist' })
  }
}

export async function outputVideoImage(res: Response, file: string) {
  try {
    const FileName = path.join(DataDir, "/imageforvideo/"+ file + ".png");
    if(isFile(FileName))   {
      const readStream = fs.createReadStream(FileName);
      res.setHeader('Content-Type', 'image/png');
      readStream.pipe(res);
      console.log("FileName Exist: ", FileName)
    }
    else {
      res.status(200).json({ error: 'File not exist', FileName: FileName })
    }
  } 
  catch (error) {
      console.error('outputVideo Error:', error);
      res.status(200).json({ error: 'File not exist' })
  }
}





















