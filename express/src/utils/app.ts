import * as fs from 'fs'
import multer from 'multer'
import path from 'path'
import * as crypto from 'crypto'
import sqlite3 from 'sqlite3';
import validator from 'validator';
import { promisify } from 'util';
import { DataDir, CONDENSE_TEMPLATE_INIT, QA_TEMPLATE_INIT } from './const';

import { db, getDbRecord, getDbRecordALL } from './db'
import { filterString, log, formatDate, getNanoid } from './utils'


type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;


  export async function addApp(Params: any) {
    try{
      console.log("ParamsParamsParamsParamsParams", Params)
      Params._id = filterString(Params._id)
      Params.teamId = filterString(Params.teamId)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.flowGroup = filterString(Params.flowGroup)
      Params.permission = filterString(Params.permission)
      Params.data = filterString(JSON.stringify(Params.data))
  
      const insertSetting = db.prepare('INSERT OR IGNORE INTO app (_id, teamId, name, intro, avatar, type, flowGroup, permission, data, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      insertSetting.run(Params._id, Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.flowGroup, Params.permission, Params.data, 1, Params.userId);
      insertSetting.finalize();
      return {"status":"ok", "msg":"Add Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function editApp(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.teamId = filterString(Params.teamId)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.flowGroup = filterString(Params.flowGroup || '')
      Params.permission = filterString(Params.permission)
      Params.data = filterString(JSON.stringify(Params.data))
      const updateSetting = db.prepare('update app set teamId = ?, name = ?, intro = ?, avatar = ?, type = ?, flowGroup = ?, permission = ?, data = ?where _id = ?');
      updateSetting.run(Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.flowGroup, Params.permission, Params.data, Params._id);
      updateSetting.finalize();
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }

  }
  
  export async function deleteApp(Params: any) {
    try{
      Params._id = filterString(Params.appId)
      Params.userId = filterString(Params.userId)
      const deleteSetting = db.prepare('delete from app where _id = ? and userId = ?');
      deleteSetting.run(Params._id, Params.userId);
      deleteSetting.finalize();
      return {"status":"ok", "msg":"Delete Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  
  }
  
  export async function getApp(id: string, userId: string) {
    const idFilter = filterString(id)
    const userIdFilter = Number(userId)
    
    const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT data from app where _id = ? and userId = ? `, [idFilter, userIdFilter]) as any[];
    
    let Template: any = {}
    if(SettingRS)  {
      SettingRS.map((Item: any)=>{
        Template = JSON.parse(Item.data)
      })
    }
  
    return Template
  }

  export async function getAppByPublishId(id: string) {
    const idFilter = filterString(id)
    
    const PublishApp: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from publish where _id = ?`, [idFilter]) as any[];
    if(PublishApp && PublishApp[0] && PublishApp[0].appId)  {
      const appid = PublishApp[0].appId
      const userId = PublishApp[0].userId
      const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT data from app where _id = ? and userId = ? `, [appid, userId]) as any[];
      let Template: any = {}
      if(SettingRS)  {
        SettingRS.map((Item: any)=>{
          Template = JSON.parse(Item.data)
        })
      }
      return {...Template, PublishApp: PublishApp[0]}
    }
    else {
      return {}
    }
  }

  export async function getAppPage(pageid: number, pagesize: number, userId: number) {
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from app where userId = ?", [userId]);
    const RecordsTotal: number = Records ? Records.NUM : 0;  
    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from app where userId = ? order by id desc limit ? OFFSET ? `, [userId, pagesizeFiler, From]) as any[];
    
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;

    return RS;
  }

  export async function getChatlogPageByApp(appId: string, pageid: number, pagesize: number, userId: number) {
    const appIdFileter = filterString(appId)
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from appchatlog where appId = ? and userId = ?", [appIdFileter, userId]);
    const RecordsTotal: number = Records ? Records.NUM : 0;  
    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from appchatlog where appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [appIdFileter, userId, pagesizeFiler, From]) as any[];
    
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;

    return RS;
  }
    
  export async function getPublishsPageByApp(appId: string, pageid: number, pagesize: number, userId: number) {
    const appIdFileter = filterString(appId)
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from publish where appId = ? and userId = ?", [appIdFileter, userId]);
    const RecordsTotal: number = Records ? Records.NUM : 0;  
    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from publish where appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [appIdFileter, userId, pagesizeFiler, From]) as any[];
    
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;

    return RS;
  }

  export async function getPublishsAll(pageid: number, pagesize: number) {
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    let Records: any = null;
    let RecordsTotal: number = Records ? Records.NUM : 0;  
    let RecordsAll: any[] = [];
    Records = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from publish");
    RecordsTotal = Records ? Records.NUM : 0;  
    RecordsAll = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from publish order by id desc limit ? OFFSET ? `, [pagesizeFiler, From]) as any[];
    
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;

    return RS;
  }

  export async function addPublish(Params: any) {
    try{
      Params._id = getNanoid(32)
      Params.name = filterString(Params.name)
      Params.maxToken = filterString(Params.maxToken)
      Params.language = filterString(Params.language)
      Params.returnReference = filterString(Params.returnReference)
      Params.ipLimitPerMinute = filterString(Params.ipLimitPerMinute)
      Params.expiredTime = filterString(Params.expiredTime)
      Params.authCheck = filterString(Params.authCheck)
      Params.userId = filterString(Params.userId)
      Params.appId = filterString(Params.appId)

      const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT id from publish where _id = ?", [Params._id]);
      const RecordId: number = Records ? Records.id : 0;

      console.log("RecordId", RecordId, Params)
      if(RecordId > 0) {
        Params.id = RecordId
        editPublish(Params)
        return {"status":"ok", "msg":"Update Success"}
      }
      else {
        const insertSetting = db.prepare('INSERT OR IGNORE INTO publish (_id, appId, name, maxToken, returnReference, ipLimitPerMinute, expiredTime, authCheck, userId, lastAccessTime, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        insertSetting.run(Params._id, Params.appId, Params.name, Params.maxToken, Params.returnReference, Params.ipLimitPerMinute, Params.expiredTime, Params.authCheck, Params.userId, '', Params.language);
        insertSetting.finalize();
        return {"status":"ok", "msg":"Add Success"}
      }
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function editPublish(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.name = filterString(Params.name)
      Params.maxToken = filterString(Params.maxToken)
      Params.language = filterString(Params.language)
      Params.returnReference = filterString(Params.returnReference)
      Params.ipLimitPerMinute = filterString(Params.ipLimitPerMinute)
      Params.expiredTime = filterString(Params.expiredTime)
      Params.authCheck = filterString(Params.authCheck)
      Params.userId = filterString(Params.userId)
      Params.appId = filterString(Params.appId)
      const updateSetting = db.prepare('update publish set name = ?, maxToken = ?, returnReference = ?, ipLimitPerMinute = ?, expiredTime = ? , language = ? where _id = ? and appId = ? and userId = ?');
      updateSetting.run(Params.name, Params.maxToken, Params.returnReference, Params.ipLimitPerMinute, Params.expiredTime, Params.language, Params._id, Params.appId, Params.userId);
      updateSetting.finalize();
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
    
  }

  export async function deletePublish(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.appId = filterString(Params.appId)
      Params.userId = filterString(Params.userId)
      const updateSetting = db.prepare('delete from publish where _id = ? and appId = ? and userId = ?');
      updateSetting.run(Params._id, Params.appId, Params.userId);
      updateSetting.finalize();
      log('Error Params:', Params);
      return {"status":"ok", "msg":"Delete Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }  
    
  }
  
  export async function getPublish(id: string, userId: string) {
    const idFilter = filterString(id)
    const userIdFilter = Number(userId)
    
    const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT data from publish where _id = ? and userId = ? `, [idFilter, userIdFilter]) as any[];
    
    let Template: any = {}
    if(SettingRS)  {
      SettingRS.map((Item: any)=>{
        Template = JSON.parse(Item.data)
      })
    }
  
    return Template
  }

  export async function getChatLogByAppIdAndUserId(appId: string, userId: number, pageid: number, pagesize: number) {
    const appIdFiler = filterString(appId);
    const userIdFiler = filterString(userId);
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;

    console.log("appIdFiler", appIdFiler, userIdFiler)
  
    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from chatlog where current = 1 and appId = ? and userId = ?", [appIdFiler, userIdFiler]);
    const RecordsTotal: number = Records ? Records.NUM : 0;
    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from chatlog where current = 1 and  appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [appIdFiler, userIdFiler, pagesizeFiler, From]) as any[];
  
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;
  
    return RS;
  }

  export async function deleteUserLogByAppId(appId: string, userId: number) {
    const UpdateChatLog = db.prepare("update chatlog set current = 0 where appId = ? and userId = ?");
    UpdateChatLog.run(appId, userId);
    UpdateChatLog.finalize();
    return {"status":"ok", "msg":"Clear History Success"}
  }

  export async function deleteUserLogByChatlogId(appId: string, userId: number, id: number) {
    const UpdateChatLog = db.prepare("delete from chatlog where appId = ? and userId = ? and _id = ?");
    UpdateChatLog.run(appId, userId, id);
    UpdateChatLog.finalize();
    return {"status":"ok", "msg":"Delete Success"}
  }