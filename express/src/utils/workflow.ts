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


  export async function addWorkflow(Params: any) {
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
  
      const insertSetting = db.prepare('INSERT OR IGNORE INTO workflow (_id, teamId, name, intro, avatar, type, flowGroup, permission, data, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      insertSetting.run(Params._id, Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.flowGroup, Params.permission, Params.data, 1, Params.userId);
      insertSetting.finalize();
      return {"status":"ok", "msg":"Add Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function editWorkflow(Params: any) {
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
      const updateSetting = db.prepare('update workflow set teamId = ?, name = ?, intro = ?, avatar = ?, type = ?, flowGroup = ?, permission = ?, data = ?where _id = ?');
      updateSetting.run(Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.flowGroup, Params.permission, Params.data, Params._id);
      updateSetting.finalize();
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
    }
  
    return {"status":"ok", "msg":"Update Success"}
  }
  
  export async function deleteWorkflow(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.userId = filterString(Params.userId)
      const deleteSetting = db.prepare('delete from workflow where _id = ? and userId = ?');
      deleteSetting.run(Params._id, Params.userId);
      deleteSetting.finalize();
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
    }
  
    return {"status":"ok", "msg":"Update Success"}
  }
  
  export async function getWorkflow(id: string, userId: string) {
    const idFilter = filterString(id)
    const userIdFilter = Number(userId)
    
    const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT data from workflow where _id = ? and userId = ? `, [idFilter, userIdFilter]) as any[];
    
    let Template: any = {}
    if(SettingRS)  {
      SettingRS.map((Item: any)=>{
        Template = JSON.parse(Item.data)
      })
    }
  
    return Template
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
        const insertSetting = db.prepare('INSERT OR IGNORE INTO publish (_id, appId, name, maxToken, returnReference, ipLimitPerMinute, expiredTime, authCheck, userId, lastAccessTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        insertSetting.run(Params._id, Params.appId, Params.name, Params.maxToken, Params.returnReference, Params.ipLimitPerMinute, Params.expiredTime, Params.authCheck, Params.userId, '');
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
      Params.returnReference = filterString(Params.returnReference)
      Params.ipLimitPerMinute = filterString(Params.ipLimitPerMinute)
      Params.expiredTime = filterString(Params.expiredTime)
      Params.authCheck = filterString(Params.authCheck)
      Params.userId = filterString(Params.userId)
      Params.appId = filterString(Params.appId)
      const updateSetting = db.prepare('update publish set name = ?, maxToken = ?, returnReference = ?, ipLimitPerMinute = ?, expiredTime = ? where _id = ? and appId = ? and userId = ?');
      updateSetting.run(Params.name, Params.maxToken, Params.returnReference, Params.ipLimitPerMinute, Params.expiredTime, Params._id, Params.appId, Params.userId);
      updateSetting.finalize();
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
    }

    return {"status":"ok", "msg":"Update Success"}
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
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
    }
  
    return {"status":"ok", "msg":"Delete Success"}
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