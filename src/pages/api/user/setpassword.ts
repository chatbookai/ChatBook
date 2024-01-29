// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { changeUserPasswordByToken } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const changeUserPasswordByTokenData = await changeUserPasswordByToken(authorization, req.body);
    res.status(200).json(changeUserPasswordByTokenData);
}
