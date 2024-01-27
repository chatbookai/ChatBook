// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { GenereateImageUsingDallE2 } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const question: string = req.body.question
    const GenereateImageUsingDallE2Data = await GenereateImageUsingDallE2(res, "Dall-E-2", question, '1024x1024');
    res.status(200).json(GenereateImageUsingDallE2Data);
}
