// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { getFilesPage } from '../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [ pageid, pagesize ] = req.query.params;
    const getFilesPageData: any = await getFilesPage(Number(pageid), Number(pagesize));
    
    res.status(200).json(getFilesPageData);
}
