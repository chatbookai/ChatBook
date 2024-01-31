// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { changeUserStatus } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const changeUserStatusData = await changeUserStatus(authorization, req.body);
    res.status(200).json(changeUserStatusData);
}
