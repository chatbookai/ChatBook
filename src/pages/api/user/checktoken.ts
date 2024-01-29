// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization);
    res.status(200).json(checkUserTokenData);
}
