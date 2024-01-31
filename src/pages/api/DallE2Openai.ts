// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { GenereateImageUsingDallE2 } from '../../utils/llms';
import { checkUserToken } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const question: string = req.body.question
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const GenereateImageUsingDallE2Data = await GenereateImageUsingDallE2(res, "Dall-E-2", checkUserTokenData.data.id, question, '1024x1024');
        res.status(200).json(GenereateImageUsingDallE2Data);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
