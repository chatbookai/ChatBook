// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { chatChatBaiduWenxin } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { knowledgeId, question, history } = req.body;
    const chatChatBaiduWenxinData: any = await chatChatBaiduWenxin(knowledgeId, question, history);    
    res.status(200).json(chatChatBaiduWenxinData);
}
