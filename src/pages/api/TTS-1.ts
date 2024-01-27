// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { GenereateAudioUsingTTS } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const question: string = req.body.question
    const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", question, 'alloy');
    res.status(200).json(GenereateAudioUsingTTSData);
}
