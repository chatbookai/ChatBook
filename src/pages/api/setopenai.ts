// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { setOpenAISetting } from '../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const setOpenAISettingData: any = await setOpenAISetting(req.body);
    
    res.status(200).json(setOpenAISettingData);
}
