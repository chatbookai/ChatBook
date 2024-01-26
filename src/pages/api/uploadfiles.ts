// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import path from 'path'
import fs from 'fs'

const DataDir = "./data"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const form = new IncomingForm();
  console.log("form", form)

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(200).json({ status: 'error', msg: 'Internal Server Error' });
      return;
    }
    try {
      if (files && Object.keys(files).length > 0) {
        Object.values(files).forEach((fileArray: any) => {
          fileArray.forEach((file: any) => {
            if (file && file.filepath) {
              const filePath = file.filepath;
              console.log('File Path:', filePath);  
              console.log('File newFilename:', file.newFilename); 
              console.log('File originalFilename:', file.originalFilename);    
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);           
              const FileNameNew = file.newFilename + '-' + uniqueSuffix + path.extname(file.originalFilename).toLowerCase();
              const targetPath = path.join(DataDir + '/uploadfiles/', path.basename(FileNameNew));
              console.log('targetPath:', targetPath);
              console.log('FileNameNew:', FileNameNew);

              fs.copyFile(filePath, targetPath, (copyErr) => {
                if (copyErr) {
                  console.error('Error copying file:', copyErr);
                }
                else {
                  console.log('File copied to:', targetPath);
                }
              });

            } 
            else {
              console.error('Filepath is null or undefined');
            }
          });
        });
      } 
      else {
        console.error('No files found in the request');
        res.status(400).json({ status: 'error', msg: 'No files found in the request' });
      }
      res.status(200).json({ status: 'ok', msg: 'Uploaded Success' });
    } 
    catch (error) {
      console.error('Error processing files:', error);
      res.status(200).json({ status: 'error', msg: 'Internal Server Error' });
    }
  });
  res.status(200).json({ status: 'error', msg: 'form is null' });
}
