// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { knowledgeId, question, history } = req.body;
    const registerUserData = await registerUser("chivescoin@gmail.com", "chivescoin@gmail.com", "8336405", "8336405", 'en');
    res.status(200).json(registerUserData);
}
