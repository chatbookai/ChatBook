// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { setTemplate } from '../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const setTemplateData: any = await setTemplate(req.body);
    
    res.status(200).json(setTemplateData);
}
