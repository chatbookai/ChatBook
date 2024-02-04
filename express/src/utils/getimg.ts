import axios from 'axios'
import * as fs from 'fs'
import { DataDir } from './const'

import { db, getDbRecord, getDbRecordALL } from './db'
import { timestampToDate } from './utils'

const GETIMG_AI_SECRET_KEY = "key-1lR6hvhiLD9jVIcFeFS2yssck9679aXDVmpHsVRZrz8pF7OSyOdqP3hOajxmPkUcL79jvRdum4mQsXfSl3ohky5cerjnxLDY"

type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;



export async function getModelsToGenereateImage() {
    const url = 'https://api.getimg.ai/v1/models?family=stable-diffusion&pipeline=text-to-image';
    const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
        },
      }).then(res=>res.data);
    response.map((Item: any)=>{
        console.log("Model ID: ", Item.id)
    })
    return response;
}

export async function getModels() {
    const url = 'https://api.getimg.ai/v1/models';
    const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
        },
      }).then(res=>res.data);
    console.log("response", response)

    return response;
}

export async function getModelDetail(id: string) {
    const url = 'https://api.getimg.ai/v1/models/' + id;
    const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
        },
      }).then(res=>res.data);
    console.log("response", response)

    return response;
}

interface StableDiffusionV1 {
  model: string
  prompt: string
  negativePrompt: string
  width: number
  height: number
  steps: number
  guidanceScale: number
  numberOfImages: number
  sampler: string
  outpuFormat: string
  seed: number | string
}

export async function generateimage(checkUserTokenData: any, data: StableDiffusionV1) {
    //return "realistic-vision-v5-1-1706996772820-667074977";
    const url = 'https://api.getimg.ai/v1/stable-diffusion/text-to-image';
    const POSTDATA: any = {}
    POSTDATA['model'] = data.model
    POSTDATA['prompt'] = data.prompt
    POSTDATA['negative_prompt'] = data.negativePrompt
    POSTDATA['width'] = data.width
    POSTDATA['height'] = data.height
    POSTDATA['steps'] = data.steps
    POSTDATA['guidance'] = data.guidanceScale
    const seed = data.seed && data.seed !='' ? data.seed : Math.floor( Math.random() * 1000000)
    POSTDATA['seed'] = Number(seed)
    POSTDATA['scheduler'] = data.sampler
    POSTDATA['output_format'] = data.outpuFormat
    console.log("POSTDATA: ", POSTDATA)

    try {
      const res = await axios.post(url, POSTDATA, {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
          },
        });
      if(res.status == 200 && res.data) {
          const Base64ToImgData = await Base64ToImg(res.data.image, data.model)      
          const cost_usd = 0.01    
          const cost_xwe = 0    
          const orderTX = ''
          const orderId = Base64ToImgData
          try {
            const insertSetting = db.prepare('INSERT INTO userimages (userId, email, model, `prompt`, negative_prompt, steps, sampler, filename, data, `date`, createtime, cost_usd, cost_xwe, cost_api, orderId, orderTX, source ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            insertSetting.run(checkUserTokenData.data.id, checkUserTokenData.data.email, POSTDATA['model'], POSTDATA['prompt'], POSTDATA['negative_prompt'], POSTDATA['steps'], POSTDATA['scheduler'], Base64ToImgData, JSON.stringify({}), timestampToDate(Date.now()), Date.now(), cost_usd, cost_xwe, res.data.cost, orderId, orderTX, 'getimg');
          }
          catch(error: any) {
            console.log("generateimage insertSetting Error", error.message)
          }
          return Base64ToImgData;
      }
      else {
          return null;
      }
    }
    catch(error: any) {
      console.log("generateimage Error", error.message)
      return null;
    }
    
}

export async function TextToImageALL() {
    const FilesList: any[] = [];
    //FilesList.push(await generateimage("stable-diffusion-v1-5"))
    //FilesList.push(await generateimage("stable-diffusion-v2-1"))
    //FilesList.push(await generateimage("realistic-vision-v1-3"))
    //FilesList.push(await generateimage("realistic-vision-v3"))
    //FilesList.push(await generateimage("realistic-vision-v5-1"))
    /*
    FilesList.push(await generateimage("absolute-reality-v1-8-1"))
    FilesList.push(await generateimage("dream-shaper-v8"))
    FilesList.push(await generateimage("dark-sushi-mix-v2-25"))
    FilesList.push(await generateimage("absolute-reality-v1-6"))
    FilesList.push(await generateimage("synthwave-punk-v2"))
    FilesList.push(await generateimage("arcane-diffusion"))
    FilesList.push(await generateimage("moonfilm-reality-v3"))
    FilesList.push(await generateimage("moonfilm-utopia-v3"))
    FilesList.push(await generateimage("moonfilm-film-grain-v1"))
    FilesList.push(await generateimage("openjourney-v4"))
    FilesList.push(await generateimage("icbinp"))
    FilesList.push(await generateimage("icbinp-final"))
    FilesList.push(await generateimage("icbinp-relapse"))
    FilesList.push(await generateimage("icbinp-afterburn"))
    FilesList.push(await generateimage("icbinp-seco"))
    FilesList.push(await generateimage("xsarchitectural-interior-design"))
    FilesList.push(await generateimage("mo-di-diffusion"))
    FilesList.push(await generateimage("anashel-rpg"))
    FilesList.push(await generateimage("eimis-anime-diffusion-v1-0"))
    FilesList.push(await generateimage("something-v2-2"))
    FilesList.push(await generateimage("analog-diffusion"))
    FilesList.push(await generateimage("neverending-dream"))
    FilesList.push(await generateimage("van-gogh-diffusion"))
    FilesList.push(await generateimage("openjourney-v1-0"))
    */
    
    return FilesList;
}

export async function TextToImageAllLatentConsistency() {
    const FilesList: any[] = [];
    FilesList.push(await TextToImageByLatentConsistency("lcm-dark-sushi-mix-v2-25"))
    //FilesList.push(await TextToImageByLatentConsistency("lcm-realistic-vision-v5-1"))
    //FilesList.push(await TextToImageByLatentConsistency("lcm-dream-shaper-v8"))
    return FilesList;
}

export async function TextToImageByLatentConsistency(model: string) {
    const url = 'https://api.getimg.ai/v1/latent-consistency/text-to-image';
    const POSTDATA: any = {}
    POSTDATA['model'] = model
    POSTDATA['prompt'] = 'pretty chinese girl, double eyelids, hair in a bun, pin sweater, studying, at night'
    POSTDATA['negative_prompt'] = 'Disfigured, cartoon, blurry'
    POSTDATA['width'] = 512
    POSTDATA['height'] = 512
    POSTDATA['steps'] = 4
    POSTDATA['seed'] = 0
    POSTDATA['output_format'] = 'png'
    const res = await axios.post(url, POSTDATA, {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
        },
      });
    //console.log("response", response)
    if(res.status == 200 && res.data) {
        const Base64ToImgData = await Base64ToImg(res.data.image, model)
        return Base64ToImgData;
    }
    else {
        return null;
    }
}


export async function Base64ToImg(Base64IMG: string, model: string) {
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

  const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)('SELECT id, userId, email, model, `prompt`, negative_prompt, steps, sampler, filename, data, `date`, createtime FROM userimages where userId = ? ORDER BY id DESC LIMIT ? OFFSET ? ', [userId, pagesizeFiler, From]) || [];

  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}























