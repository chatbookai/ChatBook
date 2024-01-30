// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getLogsPage } from '../../../utils/utils';
import { checkUserToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ pageid, pagesize ] = req.query.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLogsPageData: any = await getLogsPage(Number(pageid), Number(pagesize));
        res.status(200).json(getLogsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
