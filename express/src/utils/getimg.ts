import axios from 'axios'
import * as fs from 'fs'
import { DataDir } from './const'

import { db, getDbRecord, getDbRecordALL } from './db'
import { timestampToDate } from './utils'

const GETIMG_AI_SECRET_KEY = process.env.STABILITY_API_KEY

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
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
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























