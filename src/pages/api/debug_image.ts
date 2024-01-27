// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { GenereateImageUsingDallE2 } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const GenereateImageUsingDallE2Data = await GenereateImageUsingDallE2(res, "ChatGPT4", 'Create a photorealistic image of a serene desert landscape at sunset, featuring a fluffy orange tabby cat lounging on warm sand, with a curious expression and long shadows across the dunes.', '1024x1024');
    res.status(200).json(GenereateImageUsingDallE2Data);
}
