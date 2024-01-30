// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { setTemplate } from '../../utils/utils';
import { checkUserToken } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const setTemplateData: any = await setTemplate(req.body);
        res.status(200).json(setTemplateData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
