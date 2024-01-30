// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserLogsAll, checkUserToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getUserLogsAllData = await getUserLogsAll(Number(pageid), Number(pagesize));
        res.status(200).json(getUserLogsAllData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
