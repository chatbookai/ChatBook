// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const formidable = require('formidable')

import { InsertFilesDb, calculateFileHashSync } from '../../utils/utils'
import { checkUserToken } from '../../utils/user'

import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

const DataDirTeamp = './data/uploadfiles'

if (!fs.existsSync(DataDirTeamp)) {
  fs.mkdirSync(DataDirTeamp, { recursive: true })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization);
  if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
    const userId = checkUserTokenData.data.id
    if (req.method === 'POST') {
      const form = new formidable.IncomingForm()
  
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
          console.error('File upload error:', err)
  
          return res.status(500).json({ status: 'error', msg: 'Internal Server Error', error: err.message })
        }
  
        const knowledgeId = fields && fields.knowledgeId && fields.knowledgeId[0] ? fields.knowledgeId[0] : 0
        if (files && Object.keys(files).length > 0) {
          Object.values(files).forEach((fileArray: any) => {
            fileArray.forEach((file: any) => {
              if (file && file.filepath) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                const FileNameNew = uniqueSuffix + path.extname(file.originalFilename)
                
                const newPath = path.join(DataDirTeamp, FileNameNew)
                
                console.log("file.filepath", file.filepath)
                console.log("file.newFilename", file.newFilename)
                console.log("file.mimetype", file.mimetype)
                
                console.log("file.originalFilename", file.originalFilename)
                fs.copyFileSync(file.filepath, newPath)
                const FileHash = calculateFileHashSync(newPath)
                InsertFilesDb(knowledgeId, file.originalFilename, FileNameNew, FileHash, userId)
              }
            });
          });
        }
  
        return res.status(200).json({ status: 'ok', msg: 'Upload Successful', files })
      })
    } 
    else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
  else {
      res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
  }
  
}
