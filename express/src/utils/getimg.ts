import axios from 'axios'
import * as fs from 'fs'
import { DataDir } from './const'

const GETIMG_AI_SECRET_KEY = "key-41NQSolFm07MWJ3o2MrRQeT96nCqylPEKzGr5gSUKbP8thz9sHYeAZ8UrtR2RfJfUrXWVEdhXAjrYERcH7O8zcw514lWJma9"



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

export async function TextToImageBySD(model: string) {
    const url = 'https://api.getimg.ai/v1/stable-diffusion/text-to-image';
    const POSTDATA: any = {}
    POSTDATA['model'] = model
    POSTDATA['prompt'] = 'pretty chinese girl, double eyelids, hair in a bun, pin sweater, studying, at night'
    POSTDATA['negative_prompt'] = 'Disfigured, cartoon, blurry'
    POSTDATA['width'] = 512
    POSTDATA['height'] = 512
    POSTDATA['steps'] = 30
    POSTDATA['guidance'] = 7.5
    POSTDATA['seed'] = 0
    POSTDATA['scheduler'] = 'dpmsolver++'
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

export async function TextToImageALL() {
    const FilesList: any[] = [];
    //FilesList.push(await TextToImageBySD("stable-diffusion-v1-5"))
    //FilesList.push(await TextToImageBySD("stable-diffusion-v2-1"))
    //FilesList.push(await TextToImageBySD("realistic-vision-v1-3"))
    //FilesList.push(await TextToImageBySD("realistic-vision-v3"))
    FilesList.push(await TextToImageBySD("realistic-vision-v5-1"))
    /*
    FilesList.push(await TextToImageBySD("absolute-reality-v1-8-1"))
    FilesList.push(await TextToImageBySD("dream-shaper-v8"))
    FilesList.push(await TextToImageBySD("dark-sushi-mix-v2-25"))
    FilesList.push(await TextToImageBySD("absolute-reality-v1-6"))
    FilesList.push(await TextToImageBySD("synthwave-punk-v2"))
    FilesList.push(await TextToImageBySD("arcane-diffusion"))
    FilesList.push(await TextToImageBySD("moonfilm-reality-v3"))
    FilesList.push(await TextToImageBySD("moonfilm-utopia-v3"))
    FilesList.push(await TextToImageBySD("moonfilm-film-grain-v1"))
    FilesList.push(await TextToImageBySD("openjourney-v4"))
    FilesList.push(await TextToImageBySD("icbinp"))
    FilesList.push(await TextToImageBySD("icbinp-final"))
    FilesList.push(await TextToImageBySD("icbinp-relapse"))
    FilesList.push(await TextToImageBySD("icbinp-afterburn"))
    FilesList.push(await TextToImageBySD("icbinp-seco"))
    FilesList.push(await TextToImageBySD("xsarchitectural-interior-design"))
    FilesList.push(await TextToImageBySD("mo-di-diffusion"))
    FilesList.push(await TextToImageBySD("anashel-rpg"))
    FilesList.push(await TextToImageBySD("eimis-anime-diffusion-v1-0"))
    FilesList.push(await TextToImageBySD("something-v2-2"))
    FilesList.push(await TextToImageBySD("analog-diffusion"))
    FilesList.push(await TextToImageBySD("neverending-dream"))
    FilesList.push(await TextToImageBySD("van-gogh-diffusion"))
    FilesList.push(await TextToImageBySD("openjourney-v1-0"))
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
























