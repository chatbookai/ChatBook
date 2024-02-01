// app.ts
import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { debug } from './utils/llms';
import * as crypto from 'crypto'
import sqlite3 from 'sqlite3';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();

import { DataDir } from './utils/const';
import { checkUserPassword } from './utils/user';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 1988;

app.post('/api/user/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const checkUserPasswordData = await checkUserPassword(req, email, password);
  res.status(200).json(checkUserPasswordData);
  res.end();
});

app.get('/api/debug', async (req: Request, res: Response) => {
  await debug(res, "ChatGPT4");
  res.end();
});

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
