// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { chatChatOpenAI } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { knowledgeId, question, history } = req.body;
    await chatChatOpenAI(res, knowledgeId, question, history);
    res.end();
}
