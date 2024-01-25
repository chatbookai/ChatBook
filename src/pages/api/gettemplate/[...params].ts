// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getTemplate } from '../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ id ] = req.query.params;
    const getTemplateData: any = await getTemplate(id);
    
    res.status(200).json(getTemplateData);
}
