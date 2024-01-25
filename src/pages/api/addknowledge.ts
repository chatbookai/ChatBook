// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { addKnowledge } from '../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const addKnowledgeData: any = await addKnowledge(req.body);
    
    res.status(200).json(addKnowledgeData);
}
