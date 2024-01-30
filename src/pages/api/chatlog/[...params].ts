// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getChatLogByKnowledgeIdAndUserId } from '../../../utils/utils';
import { checkUserToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ knowledgeId, userId, pageid, pagesize ] = req.query.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getChatLogByKnowledgeIdAndUserIdData: any = await getChatLogByKnowledgeIdAndUserId(knowledgeId, Number(userId), Number(pageid), Number(pagesize));
        res.status(200).json(getChatLogByKnowledgeIdAndUserIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
