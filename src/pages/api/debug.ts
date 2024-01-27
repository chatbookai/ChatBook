// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { debug } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await debug(res, "ChatGPT4");
    res.end();
}
