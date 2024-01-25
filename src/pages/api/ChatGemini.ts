// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { chatChatGemini } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { knowledgeId, question, history } = req.body;
    await chatChatGemini(res, knowledgeId, question, history);
    res.end();
}
