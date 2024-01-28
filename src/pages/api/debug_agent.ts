// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { debug_agent } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const GenereateAudioUsingTTSData = await debug_agent(res, "TTS-1");
    res.status(200).json(GenereateAudioUsingTTSData);
}
