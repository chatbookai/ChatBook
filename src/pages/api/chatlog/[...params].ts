// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getChatLogByKnowledgeIdAndUserId } from '../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ knowledgeId, userId, pageid, pagesize ] = req.query.params;
    const getChatLogByKnowledgeIdAndUserIdData: any = await getChatLogByKnowledgeIdAndUserId(knowledgeId, Number(userId), Number(pageid), Number(pagesize));
    
    res.status(200).json(getChatLogByKnowledgeIdAndUserIdData);
}
