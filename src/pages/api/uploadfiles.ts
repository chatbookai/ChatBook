// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next'
const formidable = require('formidable')
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

const DataDir = './data/uploadfiles'

if (!fs.existsSync(DataDir)) {
  fs.mkdirSync(DataDir, { recursive: true })
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm()

    form.on('file', (field, file) => {
      if (file.originalFilename) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const FileNameNew = uniqueSuffix + path.extname(file.originalFilename)
        const newPath = path.join(DataDir, FileNameNew)
        fs.renameSync(file.filepath, newPath)
      }
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('File upload error:', err)

        return res.status(500).json({ status: 'error', msg: 'Internal Server Error', error: err.message })
      }

      return res.status(200).json({ status: 'ok', msg: 'Upload Successful', files })
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
