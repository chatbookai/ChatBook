// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserLogs, checkUserToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getUserLogsData = await getUserLogs(checkUserTokenData.data.email, Number(pageid), Number(pagesize));
        res.status(200).json(getUserLogsData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
