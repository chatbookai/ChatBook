import axios from 'axios'
import * as fs from 'fs'
import { DataDir } from './const'

const GETIMG_AI_SECRET_KEY = "key-13cAXpJj1aUw3WpqEkR2kCZE8GrsQcMYP78FYlzscbx9DMTfwMxTLmjR8h3VnIhb8VsiKXlnV7LIkT6wu1ND3mjhvp76iCww"




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

export async function TextToImageBySD(id: string) {
    const url = 'https://api.getimg.ai/v1/stable-diffusion/text-to-image';
    const POSTDATA: any = {}
    POSTDATA['model'] = 'stable-diffusion-v1-5'
    POSTDATA['prompt'] = 'mysterious silhouette woman with hat, by Minjae Lee, Carne Griffiths, Emily Kell, Steve McCurry, Geoffroy Thoorens, Aaron Horkey, Jordan Grimmer, Greg Rutkowski, amazing depth, double exposure, surreal, geometric patterns, intricately detailed, bokeh, perfect balanced, deep fine borders, artistic photorealism , smooth, great masterwork by head of prompt engineering'
    POSTDATA['negative_prompt'] = 'Disfigured, cartoon, blurry'
    POSTDATA['width'] = 512
    POSTDATA['height'] = 512
    POSTDATA['steps'] = 25
    POSTDATA['guidance'] = 7.5
    POSTDATA['seed'] = 0
    POSTDATA['scheduler'] = 'dpmsolver++'
    POSTDATA['output_format'] = 'png'
    const response = await axios.post(url, POSTDATA, {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Bearer ${GETIMG_AI_SECRET_KEY}`,
        },
      }).then(res=>res.data);
    console.log("response", response)

    return response;
}

export async function Base64ToImg(Base64IMG: string) {
    const decodedImg = Buffer.from(Base64IMG, 'base64');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const FileName = DataDir + "/image/" +uniqueSuffix + '.png';
    fs.writeFileSync(FileName, decodedImg);
}
























