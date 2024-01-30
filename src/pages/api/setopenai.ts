// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { setOpenAISetting } from '../../utils/utils';
import { checkUserToken } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const setOpenAISettingData: any = await setOpenAISetting(req.body);
        res.status(200).json(setOpenAISettingData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
