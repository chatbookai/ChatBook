// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { changeUserDetail } from '../../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const changeUserDetailData = await changeUserDetail(authorization, req.body);
    res.status(200).json(changeUserDetailData);
}
