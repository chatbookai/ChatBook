// app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { dirname, join } from 'path';

import { ChatBookDbInit, isElectron } from './utils/db.js';
import { parseFilesAndWeb, vectorDdProcess } from './utils/llms.js';

import userRouter from './router/user.js'
import llmsRouter from './router/llms.js'
import utilsRouter from './router/utils.js'
import appRouter from './router/app.js'
import datasetRouter from './router/dataset.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Start Express Server
const app = express();
const port = 1988;
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

// console.log("process.env: ", process.env);

//Initial Database and Folder

//Running in express, not in electron
if(isElectron() == false) {
  ChatBookDbInit()
}

//Schedule Task for Parse Upload Files
cron.schedule('*/3 * * * *', () => {
  console.log('Task Begin !');
  parseFilesAndWeb();
  vectorDdProcess();
  console.log('Task End !');
  //downloadVideoFromAPI();
});

app.use('/', userRouter);
app.use('/', llmsRouter);
app.use('/', utilsRouter);
app.use('/', appRouter);
app.use('/', datasetRouter);

//app.use('/', getimgRouter);
//app.use('/', stabilityRouter);
//app.use('/', seaartRouter);

app.use((err, req, res, next) => {
  // 处理身份验证错误
  if (err.name === 'AuthenticationError') {
    console.error('AuthenticationError:', err.message);
    res.status(200).json({ error: 'Authentication failed' });
  } 
  else {
    // 处理其他错误
    console.error('Unexpected error:', err);
    res.status(200).json({ error: 'Internal Server Error' });
  }
});

app.use(express.static(join(__dirname, '../out')));

const startServer = (port) => {
  return app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
  });
};

const getPort = () => {
  return port;
};

const server = startServer(port);

export { app, server, getPort };