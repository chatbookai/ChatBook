// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';

import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const form = new IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
      return;
    }

    try {
      // 在 files 对象中获取上传的文件
      const uploadedFiles = Object.values(files);

      console.log("uploadedFiles", uploadedFiles)

      // 其他逻辑，例如保存文件等
      // ...

      res.status(200).json({ status: 'ok', msg: 'Uploaded Success' });
    } catch (error) {
      console.error('Error processing files:', error);
      res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
  });
}
