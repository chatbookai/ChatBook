import sqlite3 from 'sqlite3';

// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { enableDir } from '../../utils/utils';
import { DataDir, CONDENSE_TEMPLATE_INIT, QA_TEMPLATE_INIT } from '../../utils/const';


let initialized = false;

async function initChatBookDb() {
    enableDir(DataDir);
    enableDir(DataDir + '/uploadfiles/');
    enableDir(DataDir + '/parsedfiles/');
    enableDir(DataDir + '/audio/');
    enableDir(DataDir + '/image/');
    enableDir(DataDir + '/video/');
    
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
        db.run(`
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE not null,
                username TEXT UNIQUE not null,
                firstname TEXT not null default '',
                lastname TEXT not null default '',                
                organization TEXT not null default '',             
                role TEXT not null default 'user',
                mobile TEXT not null default '',
                address TEXT not null default '',
                state TEXT not null default '',
                zipcode TEXT not null default '',
                country TEXT not null default '',
                language TEXT not null default '',
                timezone TEXT not null default '',
                nickname TEXT not null default '',
                birthday TEXT not null default '',
                avatar TEXT not null default '',
                mobile_status INTEGER not null default 0,
                google_auth TEXT not null default '',
                github_auth TEXT not null default '',
                user_type TEXT not null default '',
                user_status INTEGER not null default 1,
                password TEXT not null default '',
                createtime INTEGER not null default 0
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
