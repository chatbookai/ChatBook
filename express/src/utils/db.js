// globals.ts
import fs from 'fs'
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { enableDir } from './utils.js';

let initialized = false;
let ChatBookSetting = null
let db = null
let getDbRecord = null
let getDbRecordALL = null

export function initChatBookSetting(Data) {
    console.log("ChatBookSettingChatBookSetting", Data)
    ChatBookSetting = Data
}

export function ChatBookDbPool() {

    const DataDir = ChatBookSetting?.NodeStorageDirectory;
    
    if(DataDir == undefined || DataDir == null || !isDirectorySync(DataDir)) {
        return {DataDir: null, db: null, getDbRecord: null, getDbRecordALL: null}
    }
    
    if(db == null) {
        db = new sqlite3.Database(DataDir + '/ChatBookSqlite3.db', { encoding: 'utf8' });
    }

    if(getDbRecord == null) {
        getDbRecord = promisify(db.get.bind(db));
    }

    if(getDbRecordALL == null) {
        getDbRecordALL = promisify(db.all.bind(db));
    }

    return {DataDir, db, getDbRecord, getDbRecordALL}
}

export function ChatBookDbInit() {
  let exeStatus = 0  
  if (!initialized) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    
    if(!isDirectorySync(DataDir)) {
        return {DataDir: null, db: null, getDbRecord: null, getDbRecordALL: null}
    }

    console.log("ChatBookDbInit", db, DataDir)

    enableDir(DataDir);
    enableDir(DataDir + '/audio/');
    enableDir(DataDir + '/avatarforapp/');
    enableDir(DataDir + '/avatarfordataset/');
    enableDir(DataDir + '/image/');
    enableDir(DataDir + '/imageforimage/');
    enableDir(DataDir + '/imageforvideo/');
    enableDir(DataDir + '/LanceDB/');
    enableDir(DataDir + '/uploadfiles/');
    enableDir(DataDir + '/parsedfiles/');
    enableDir(DataDir + '/video/');

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS collection (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                _id TEXT not null,
                datasetId INTEGER not null,
                type TEXT not null default 'File',
                name TEXT not null default '',
                content TEXT not null default '',
                suffixName TEXT not null,
                newName TEXT UNIQUE not null,
                originalName TEXT not null,
                fileHash TEXT not null,
                trainingMode TEXT not null default '',
                processWay TEXT not null default '',
                IdealChunkLength TEXT not null default '',
                CustomSplitChar TEXT not null default '',
                status INTEGER not null default 0,
                timestamp INTEGER not null default 0,
                userId INTEGER not null,
                data TEXT not null default '',
                dataTotal TEXT not null default '',
                folder TEXT not null default '',
                updateTime TEXT not null default ''
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                datetime TEXT not null,
                content TEXT not null,
                appId TEXT not null,
                publishId TEXT not null,
                userId TEXT not null
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS chatlog (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                _id TEXT not null,
                send TEXT not null,
                received TEXT not null,
                userId INTEGER not null default 0,
                timestamp INTEGER not null default 0,
                source TEXT not null,
                history TEXT not null,
                current INTEGER not null default 1,
                responseTime INTEGER not null default 0,
                appId TEXT not null,
                publishId TEXT not null
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
        db.run(`
            CREATE TABLE IF NOT EXISTS userlog (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT not null default '',
                browsertype TEXT not null default '',
                browserversion TEXT not null default '',
                os TEXT not null default '',
                device TEXT not null default '',
                location TEXT not null default '',
                country TEXT not null default '',
                ipaddress TEXT not null default '',
                recentactivities INTEGER not null default 0,
                action TEXT not null default '',
                msg TEXT not null default ''
            );
        `);
        db.run(`insert or ignore into user (email, username, role, password, createtime) values('chatbook-admin@gmail.com', 'chatbook-admin', 'admin', '$2b$10$JWPrDnyv3v3ov3B0BuQXtOvy.rpci6RY4Cqi33kFAeDx1RfhUjN6.', '`+Date.now()+`');`);
        db.run(`insert or ignore into user (email, username, role, password, createtime) values('chatbook-user@gmail.com', 'chatbook-user', 'user', '$2b$10$JWPrDnyv3v3ov3B0BuQXtOvy.rpci6RY4Cqi33kFAeDx1RfhUjN6.', '`+Date.now()+`');`);
        db.run(`
            CREATE TABLE IF NOT EXISTS userimages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT not null,
                email TEXT not null,
                model TEXT not null,
                prompt TEXT not null,
                negative_prompt TEXT not null,
                steps TEXT not null,
                seed TEXT not null,
                style TEXT not null,
                filename TEXT not null,
                data TEXT not null,
                date INTEGER not null default 0,
                createtime INTEGER not null default 0,
                cost_usd INTEGER not null default 0,
                cost_xwe INTEGER not null default 0,
                cost_api INTEGER not null default 0,
                orderId TEXT not null,
                orderTX TEXT not null,
                source TEXT not null,
                star INTEGER not null default 0,
                like INTEGER not null default 0,
                favorite INTEGER not null default 0,
                referee INTEGER not null default 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS uservideos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT not null,
                email TEXT not null,
                model TEXT not null,
                motion INTEGER not null default 0,
                cfg_scale INTEGER not null default 0,
                seed INTEGER not null default 0,
                filename TEXT not null,
                data TEXT not null,
                date INTEGER not null default 0,
                createtime INTEGER not null default 0,
                cost_usd INTEGER not null default 0,
                cost_xwe INTEGER not null default 0,
                cost_api INTEGER not null default 0,
                orderId TEXT not null,
                orderTX TEXT not null,
                source TEXT not null,
                star INTEGER not null default 0,
                like INTEGER not null default 0,
                favorite INTEGER not null default 0,
                referee INTEGER not null default 0,
                status INTEGER not null default 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS userimagefavorite (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER not null default 0,
                imageId INTEGER not null default 0,
                status INTEGER not null default 0,
                createtime INTEGER not null default 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS userimagelike (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER not null default 0,
                imageId INTEGER not null default 0,
                status INTEGER not null default 0,
                createtime INTEGER not null default 0
            );
        `); 
        db.run(`
            CREATE TABLE IF NOT EXISTS uservideofavorite (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER not null default 0,
                videoId INTEGER not null default 0,
                status INTEGER not null default 0,
                createtime INTEGER not null default 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS uservideolike (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER not null default 0,
                videoId INTEGER not null default 0,
                status INTEGER not null default 0,
                createtime INTEGER not null default 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS app (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                _id TEXT KEY not null,
                teamId TEXT not null,
                name TEXT not null,
                intro TEXT not null,
                avatar TEXT not null,
                type TEXT not null,
                groupOne TEXT not null default '通用',
                groupTwo TEXT not null default '写作',
                permission TEXT not null,
                data TEXT not null,
                status INTEGER not null default 1,
                userId INTEGER not null default 0,
                language TEXT not null default 'en',
                createtime INTEGER not null default 0,
                UNIQUE(_id)
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS userapp (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER not null default 0,
                appId INTEGER not null default 0,
                createtime INTEGER not null default 0,
                UNIQUE(userId, appId)
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS publish (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                _id TEXT KEY not null,
                appId TEXT not null,
                name TEXT not null,
                maxToken TEXT not null,
                returnReference INTEGER not null default 0,
                ipLimitPerMinute INTEGER not null default 100,
                expiredTime TEXT not null,
                authCheck TEXT not null,
                lastAccessTime TEXT not null,
                userId INTEGER not null default 0,
                language TEXT not null default 'en'
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS appchatlog (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                _id TEXT KEY not null,
                appId TEXT not null,
                name TEXT not null default '',
                source TEXT not null default '',
                time TEXT not null default '',
                totalMsg INTEGER not null default 0,
                userFeedback TEXT not null default '',
                defineFeedback TEXT not null default '',
                answerAmount INTEGER not null default 0,
                userId INTEGER not null default 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS dataset (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                _id TEXT not null,
                teamId TEXT not null,
                name TEXT not null,
                avatar TEXT not null default '',
                type TEXT not null default '',
                vectorModel TEXT not null default '',
                singleDataUpLimit INTEGER not null default 0,
                fileDealModel TEXT not null default '',
                intro TEXT not null default '',
                permission TEXT not null default '',
                createTime TEXT not null default '',
                folder TEXT not null default '',
                userId INTEGER not null,
                syncStatus INTEGER not null default 0
            );
        `);
        
    });

    initialized = true;
    exeStatus = 1
  }
  console.log("ChatBookDbInit exeStatus", exeStatus)
  console.log("ChatBookDbInit initialized", initialized)
}

function isDirectorySync(path) {
    try {
        if(path == undefined || path == null) {
            return false
        }
        const stats = fs.statSync(path);
        return stats.isDirectory();
    } catch (err) {
        console.error('isDirectorySync Error checking if path is a directory:', err);
        return false;
    }
  }