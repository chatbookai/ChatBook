// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getLogsPage } from '../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ pageid, pagesize ] = req.query.params;
    const getLogsPageData: any = await getLogsPage(Number(pageid), Number(pagesize));
    
    res.status(200).json(getLogsPageData);
}
