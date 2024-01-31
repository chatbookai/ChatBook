// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { GenereateAudioUsingTTS } from '../../utils/llms';
import { checkUserToken } from '../../utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const question: string = req.body.question
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", checkUserTokenData.data.id, question, 'alloy');
        res.status(200).json(GenereateAudioUsingTTSData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
