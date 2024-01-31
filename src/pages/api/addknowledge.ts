// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { addKnowledge } from '../../utils/utils';
import { checkUserToken } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenDatacheckUserTokenDatacheckUserTokenDatacheckUserTokenData", checkUserTokenData)
        const addKnowledgeData: any = await addKnowledge({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addKnowledgeData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
