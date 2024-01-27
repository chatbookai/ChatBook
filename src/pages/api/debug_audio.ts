// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { GenereateAudioUsingTTS } from '../../utils/llms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", '我的知识是基于最新的数据和信息进行训练的，但具体的截止日期可能会有所不同。通常情况下，我会尽量保持最新的知识，并且会不断更新和学习新的内容。如果你有特定的问题或者需要特定日期的信息，我会尽力提供最准确的答案。', 'alloy');
    res.status(200).json(GenereateAudioUsingTTSData);
}
