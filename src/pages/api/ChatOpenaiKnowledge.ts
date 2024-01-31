// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { chatKnowledgeOpenAI } from '../../utils/llms';
import { checkUserToken } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { knowledgeId, question, history } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        await chatKnowledgeOpenAI(res, knowledgeId, checkUserTokenData.data.id, question, history);
        res.end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
