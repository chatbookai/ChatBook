// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { chatKnowledgeOpenAI } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { knowledgeId, question, history } = req.body;
    await chatKnowledgeOpenAI(res, knowledgeId, question, history);
    res.end();
}
