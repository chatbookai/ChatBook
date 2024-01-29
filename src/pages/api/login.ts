// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserPassword } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const checkUserPasswordData = await checkUserPassword(email, password);
    res.status(200).json(checkUserPasswordData);
}
