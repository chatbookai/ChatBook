// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getLLMSSetting } from '../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ id ] = req.query.params;
    const getLLMSSettingData: any = await getLLMSSetting(id);
    
    res.status(200).json(getLLMSSettingData);
}
