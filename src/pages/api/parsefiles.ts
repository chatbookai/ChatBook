// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { parseFiles } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const parseFilesData: any = await parseFiles();
    
    res.status(200).send("Execute finished, logs in the console or the log page");
}
