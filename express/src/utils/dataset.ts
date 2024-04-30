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

  export async function addDataset(Params: any) {
    try{
      console.log("ParamsParamsParamsParamsParams", Params)
      Params._id = filterString(Params._id)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.vectorModel = filterString(Params.vectorModel)
      Params.singleDataUpLimit = filterString(Params.singleDataUpLimit || 3000)
      Params.fileDealModel = filterString(Params.fileDealModel)
      Params.permission = filterString(Params.permission || 'private')
  
      const insertSetting = db.prepare('INSERT OR IGNORE INTO dataset (_id, teamId, name, intro, avatar, type, vectorModel, singleDataUpLimit, fileDealModel, permission, createTime, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      insertSetting.run(Params._id, Params._id, Params.name, Params.intro, Params.avatar, Params.type, Params.vectorModel, Params.singleDataUpLimit, Params.fileDealModel, Params.permission, 'createTime', Params.userId);
      insertSetting.finalize();
      log('Error Params:', Params);
      return {"status":"ok", "msg":"Add Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function editDataset(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.teamId = filterString(Params.teamId)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.vectorModel = filterString(Params.vectorModel || '')
      Params.fileDealModel = filterString(Params.fileDealModel || '')
      Params.permission = filterString(Params.permission)
      const updateSetting = db.prepare('update dataset set teamId = ?, name = ?, intro = ?, avatar = ?, type = ?, vectorModel = ?, permission = ?, fileDealModel = ? where _id = ?');
      updateSetting.run(Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.vectorModel, Params.permission, Params.fileDealModel, Params._id);
      updateSetting.finalize();
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  
  }
  
  export async function deleteDataset(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.userId = filterString(Params.userId)
      const deleteSetting = db.prepare('delete from dataset where _id = ? and userId = ?');
      deleteSetting.run(Params._id, Params.userId);
      deleteSetting.finalize();
      return {"status":"ok", "msg":"Delete Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  
  }
  
  export async function getDataset(id: string, userId: string) {
    const idFilter = filterString(id)
    const userIdFilter = Number(userId)
    
    const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from dataset where _id = ? and userId = ? `, [idFilter, userIdFilter]) as any[];
    
    let Template: any = {}
    if(SettingRS)  {
      SettingRS.map((Item: any)=>{
        Template = Item
      })
    }
  
    return Template
  }

  export async function getCollectionPageByDataset(datasetId: string, pageid: number, pagesize: number, userId: number) {
    const datasetIdFileter = filterString(datasetId)
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from collection where datasetId = ? and userId = ?", [datasetIdFileter, userId]);
    const RecordsTotal: number = Records ? Records.NUM : 0;  
    const RecordsAll: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from collection where datasetId = ? and userId = ? order by id desc limit ? OFFSET ? `, [datasetIdFileter, userId, pagesizeFiler, From]) as any[];
    
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;

    return RS;
  }

  export async function getCollectionAll(pageid: number, pagesize: number) {
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
    RecordsAll = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from collection order by id desc limit ? OFFSET ? `, [pagesizeFiler, From]) as any[];
    
    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;

    return RS;
  }

  export async function addCollection(Params: any) {
    try{
      Params._id = getNanoid(32)
      Params.name = filterString(Params.name)
      Params.maxToken = filterString(Params.maxToken)
      Params.returnReference = filterString(Params.returnReference)
      Params.ipLimitPerMinute = filterString(Params.ipLimitPerMinute)
      Params.expiredTime = filterString(Params.expiredTime)
      Params.authCheck = filterString(Params.authCheck)
      Params.userId = filterString(Params.userId)
      Params.datasetId = filterString(Params.datasetId)

      const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT id from collection where _id = ?", [Params._id]);
      const RecordId: number = Records ? Records.id : 0;

      console.log("RecordId", RecordId, Params)
      if(RecordId > 0) {
        Params.id = RecordId
        editCollection(Params)
        return {"status":"ok", "msg":"Update Success"}
      }
      else {
        const insertSetting = db.prepare('INSERT OR IGNORE INTO collection (_id, datasetId, name, maxToken, returnReference, ipLimitPerMinute, expiredTime, authCheck, userId, lastAccessTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        insertSetting.run(Params._id, Params.datasetId, Params.name, Params.maxToken, Params.returnReference, Params.ipLimitPerMinute, Params.expiredTime, Params.authCheck, Params.userId, '');
        insertSetting.finalize();
        return {"status":"ok", "msg":"Add Success"}
      }
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function editCollection(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.name = filterString(Params.name)
      Params.maxToken = filterString(Params.maxToken)
      Params.returnReference = filterString(Params.returnReference)
      Params.ipLimitPerMinute = filterString(Params.ipLimitPerMinute)
      Params.expiredTime = filterString(Params.expiredTime)
      Params.authCheck = filterString(Params.authCheck)
      Params.userId = filterString(Params.userId)
      Params.datasetId = filterString(Params.datasetId)
      const updateSetting = db.prepare('update collection set name = ?, maxToken = ?, returnReference = ?, ipLimitPerMinute = ?, expiredTime = ? where _id = ? and datasetId = ? and userId = ?');
      updateSetting.run(Params.name, Params.maxToken, Params.returnReference, Params.ipLimitPerMinute, Params.expiredTime, Params._id, Params.datasetId, Params.userId);
      updateSetting.finalize();
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }

  }

  export async function deleteCollection(Params: any) {
    try{
      Params._id = filterString(Params._id)
      Params.datasetId = filterString(Params.datasetId)
      Params.userId = filterString(Params.userId)
      const updateSetting = db.prepare('delete from collection where _id = ? and datasetId = ? and userId = ?');
      updateSetting.run(Params._id, Params.datasetId, Params.userId);
      updateSetting.finalize();
      log('Error Params:', Params);
      return {"status":"ok", "msg":"Delete Success"}
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
      return {"status":"error", "msg":error.message}
    }
    
  }
  
  export async function getCollection(id: string, userId: string) {
    const idFilter = filterString(id)
    const userIdFilter = Number(userId)
    
    const SettingRS: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT data from collection where _id = ? and userId = ? `, [idFilter, userIdFilter]) as any[];
    
    let Template: any = {}
    if(SettingRS)  {
      SettingRS.map((Item: any)=>{
        Template = JSON.parse(Item.data)
      })
    }
  
    return Template
  }