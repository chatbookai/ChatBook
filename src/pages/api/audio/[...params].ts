// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { outputAudio } from '../../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ file ] = req.query.params;
    outputAudio(res, file);
}
