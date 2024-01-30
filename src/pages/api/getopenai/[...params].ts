// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getLLMSSetting } from '../../../utils/utils';
import { checkUserToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ id ] = req.query.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData: any = await getLLMSSetting(id);
        res.status(200).json(getLLMSSettingData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
