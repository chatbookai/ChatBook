// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const registerUserData = await registerUser(email, email, password, password, 'en');
    res.status(200).json(registerUserData);
}
