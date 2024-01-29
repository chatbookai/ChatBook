// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getOneUserByToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const getOneUserByTokenData = await getOneUserByToken(authorization);
    res.status(200).json(getOneUserByTokenData);
}
