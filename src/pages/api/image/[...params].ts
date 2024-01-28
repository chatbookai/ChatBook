// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { outputImage } from '../../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ file ] = req.query.params;
    outputImage(res, file);
}
