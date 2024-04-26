import * as fs from 'fs'
import multer from 'multer'
import path from 'path'
import * as crypto from 'crypto'
import sqlite3 from 'sqlite3';
import validator from 'validator';
import { promisify } from 'util';
import { DataDir, CONDENSE_TEMPLATE_INIT, QA_TEMPLATE_INIT } from './const';

import { db, getDbRecord, getDbRecordALL } from './db'
import { filterString, log, formatDate } from './utils'


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
  
    return {"status":"ok", "msg":"Updated Success"}
  }
  
  export async function deleteWorkflow(Params: any) {
    try{
      Params.id = Number(Params.id)
      Params.name = filterString(Params.name)
      Params.summary = filterString(Params.summary)
      const formatDateValue = formatDate(Date.now())
      const updateSetting = db.prepare('update workflow set title = ?, description = ?, tags = ?, config = ?, avatar = ?, author = ?, createDate = ?, status = ?, model = ?, type = ? where id = ?');
      updateSetting.run(Params.title, Params.description, Params.tags, Params.config, Params.avatar, Params.author, formatDateValue, Params.status, Params.model, Params.type, Params.id);
      updateSetting.finalize();
    }
    catch (error: any) {
      log('Error setOpenAISetting:', error.message);
    }
  
    return {"status":"ok", "msg":"Updated Success"}
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