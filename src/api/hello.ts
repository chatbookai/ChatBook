// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name = 'World' } = req.query
  
  return res.json({
    message: `Hello ${name}!`,
  })
}