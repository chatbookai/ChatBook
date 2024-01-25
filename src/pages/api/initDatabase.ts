import sqlite3 from 'sqlite3';

// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { enableDir } from '../../utils/utils';

let initialized = false;

const DataDir = "./data"

const CONDENSE_TEMPLATE_INIT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;

const QA_TEMPLATE_INIT = `You are an expert researcher. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
Helpful answer in markdown:`;

async function initChatBookDb() {
    enableDir(DataDir);
    enableDir(DataDir + '/uploadfiles/');
    enableDir(DataDir + '/parsedfiles/');

    // @ts-ignore
    const db = new sqlite3.Database(DataDir + '/ChatBookSqlite3.db', { encoding: 'utf8' });
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS setting (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT KEY not null,
                content TEXT not null,
                type TEXT not null,
                knowledgeId TEXT not null,
                userId INTEGER not null,
                UNIQUE(name, userId, knowledgeId)
            );
        `);
        db.run(`insert or ignore into setting (name, content, type, knowledgeId, userId) values('OPENAI_API_BASE','','openaisetting',1,1);`);
        db.run(`insert or ignore into setting (name, content, type, knowledgeId, userId) values('OPENAI_API_KEY','','openaisetting',1,1);`);
        db.run(`insert or ignore into setting (name, content, type, knowledgeId, userId) values('Temperature','0.1','openaisetting',1,1);`);
        db.run(`insert or ignore into setting (name, content, type, knowledgeId, userId) values('ModelName','gpt-3.5-turbo','openaisetting',1,1);`);
        db.run(`insert or ignore into setting (name, content, type, knowledgeId, userId) values('CONDENSE_TEMPLATE',?,'TEMPLATE',1,1);`, [CONDENSE_TEMPLATE_INIT]);
        db.run(`insert or ignore into setting (name, content, type, knowledgeId, userId) values('QA_TEMPLATE',?,'TEMPLATE',1,1);`, [QA_TEMPLATE_INIT]);
        db.run(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                knowledgeId INTEGER not null,
                suffixName TEXT not null,
                newName TEXT UNIQUE not null,
                originalName TEXT not null,
                hash TEXT not null,
                status INTEGER not null default 0,
                summary TEXT not null default '',
                timestamp INTEGER not null default 0,
                userId INTEGER not null
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                datetime TEXT not null,
                content TEXT not null,
                knowledgeId INTEGER not null,
                userId INTEGER not null
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS knowledge (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT not null,
                summary TEXT not null,
                timestamp INTEGER not null default 0,
                userId INTEGER not null,
                UNIQUE(name, userId)
            );
        `);
        db.run(`insert or ignore into knowledge (id, name, summary, timestamp, userId) values(1, 'Default','Default','`+Date.now()+`', 1);`);
        db.run(`
            CREATE TABLE IF NOT EXISTS chatlog (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                knowledgeId TEXT not null default 0,
                send TEXT  not null,
                received TEXT not null,
                userId INTEGER not null default 0,
                timestamp INTEGER not null default 0,
                source TEXT not null,
                history TEXT not null
            );
        `);
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let exeStatus = 0  
  if (!initialized) {
    await initChatBookDb();
    initialized = true;
    exeStatus = 1
  }
  res.status(200).json({ message: 'Database is initialized!', exeStatus });
}
