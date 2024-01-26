// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const formidable = require('formidable')

import { InsertFilesDb, calculateFileHashSync } from '../../utils/utils';

import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

const DataDirTeamp = './data/uploadfiles'
const userId = 1

if (!fs.existsSync(DataDirTeamp)) {
  fs.mkdirSync(DataDirTeamp, { recursive: true })
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
              if (!fs.existsSync(DataDirTeamp + '/' + String(userId) + '/' + String(knowledgeId))) {
                fs.mkdirSync(DataDirTeamp + '/' + String(userId) + '/' + String(knowledgeId), { recursive: true })
              }
              const newPath = path.join(DataDirTeamp + '/' + String(userId) + '/' + String(knowledgeId), FileNameNew)
              
              //console.log("file.filepath", file.filepath)
              //console.log("file.newFilename", file.newFilename)
              //console.log("file.mimetype", file.mimetype)
              
              console.log("file.originalFilename", file.originalFilename)
              fs.copyFileSync(file.filepath, newPath)
              const FileHash = calculateFileHashSync(newPath)
              InsertFilesDb(knowledgeId, file.originalFilename, FileNameNew, FileHash)
            }
          });
        });
      }

      return res.status(200).json({ status: 'ok', msg: 'Upload Successful', files })
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
