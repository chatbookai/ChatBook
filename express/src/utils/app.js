
import { ChatBookDbPool } from './db.js'
import { filterString, log, getNanoid, base64Encode, base64Decode } from './utils.js'



  export async function addApp(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    try{
      console.log("ParamsParamsParamsParamsParams", Params)
      Params._id = filterString(Params._id)
      Params.teamId = filterString(Params.teamId)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.groupOne = filterString(Params.groupOne)
      Params.groupTwo = filterString(Params.groupTwo)
      Params.permission = filterString(Params.permission)
      Params.language = filterString(Params.language)
      Params.data = base64Encode(JSON.stringify(Params.data))
  
      const insertSetting = db.prepare('INSERT OR IGNORE INTO app (_id, teamId, name, intro, avatar, type, groupTwo, groupOne, permission, data, status, userId, language, createtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      insertSetting.run(Params._id, Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.groupOne, Params.groupTwo, Params.permission, Params.data, 1, Params.userId, Params.language, Date.now());
      insertSetting.finalize();
      log(Params._id, 'addApp', Params.userId, 'Success addApp:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Add Success"}
    }
    catch (error) {
      log(Params._id, 'addApp', Params.userId, 'Error addApp:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function editApp(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    try{
      Params._id = filterString(Params._id)
      Params.teamId = filterString(Params.teamId)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.groupOne = filterString(Params.groupOne || '')
      Params.groupTwo = filterString(Params.groupTwo || '')
      Params.permission = filterString(Params.permission)
      Params.language = filterString(Params.language)
      Params.data = typeof Params.data === 'string' ? Params.data : JSON.stringify(Params.data)
      const updateSetting = db.prepare('update app set teamId = ?, name = ?, intro = ?, avatar = ?, type = ?, groupOne = ?, groupTwo = ?, permission = ?, data = ?, language = ? where _id = ?');
      updateSetting.run(Params.teamId, Params.name, Params.intro, Params.avatar, Params.type, Params.groupOne, Params.groupTwo, Params.permission, base64Encode(Params.data), Params.language, Params._id);
      updateSetting.finalize();
      log(Params._id, 'editApp', Params.userId, 'Success editApp:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error) {
      log(Params._id, 'editApp', Params.userId, 'Error editApp:', error.message);
      return {"status":"error", "msg":error.message}
    }

  }

  export async function editAppById(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    try{
      Params._id = filterString(Params._id)
      Params.teamId = filterString(Params.teamId)
      Params.name = filterString(Params.name)
      Params.intro = filterString(Params.intro)
      Params.avatar = filterString(Params.avatar)
      Params.type = filterString(Params.type)
      Params.groupOne = filterString(Params.groupOne || '')
      Params.groupTwo = filterString(Params.groupTwo || '')
      Params.permission = filterString(Params.permission)
      Params.language = filterString(Params.language)
      const updateSetting = db.prepare('update app set teamId = ?, name = ?, intro = ?, avatar = ?, groupOne = ?, groupTwo = ?, permission = ?, language = ? where _id = ?');
      updateSetting.run(Params.teamId, Params.name, Params.intro, Params.avatar, Params.groupOne, Params.groupTwo, Params.permission, Params.language, Params._id);
      updateSetting.finalize();
      log(Params._id, 'editAppById', Params.userId, 'Success editAppById:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error) {
      log(Params._id, 'editAppById', Params.userId, 'Error editAppById:', error.message);
      return {"status":"error", "msg":error.message}
    }

  }

  export async function deleteApp(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    try{
      Params._id = filterString(Params.appId)
      Params.userId = filterString(Params.userId)
      const deleteSetting = db.prepare('delete from app where _id = ? and userId = ?');
      deleteSetting.run(Params._id, Params.userId);
      deleteSetting.finalize();
      log(Params._id, 'deleteApp', Params.userId, 'Success deleteApp:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Delete Success"}
    }
    catch (error) {
      log(Params._id, 'deleteApp', Params.userId, 'Error deleteApp:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function deleteAppById(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    try{
      Params._id = filterString(Params._id)
      Params.id = filterString(Params.id)
      const deleteSetting = db.prepare('delete from app where _id = ? and id = ?');
      deleteSetting.run(Params._id, Params.id);
      deleteSetting.finalize();
      log(Params._id, 'deleteAppById', Params.userId, 'Success deleteAppById:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Delete Success", Params}
    }
    catch (error) {
      log(Params._id, 'deleteAppById', Params.userId, 'Error deleteAppById:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function getApp(id, userId) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const idFilter = filterString(id)
      
      const SettingRS = await (getDbRecordALL)(`SELECT data, avatar, name, intro, type, groupTwo, permission from app where _id = ? `, [idFilter]);
      
      let Template = {}
      if(SettingRS)  {
        SettingRS.map((Item)=>{
          const TemplateTemp = JSON.parse(base64Decode(Item.data))
          Template = {...TemplateTemp, avatar: Item.avatar, name: Item.name, intro: Item.intro, type: Item.type, groupTwo: Item.groupTwo, permission: Item.permission}
        })
      }
    
      return Template
    }
    catch (error) {
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getAppById(_id, id) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const _idFilter = filterString(_id)
      const idFilter = filterString(id)
      
      const SettingRS = await (getDbRecordALL)(`SELECT data, avatar, name, intro, type, groupTwo, permission from app where _id = ? and id = ? `, [_idFilter, idFilter]);
      
      let Template = {}
      if(SettingRS)  {
        SettingRS.map((Item)=>{
          const TemplateTemp = JSON.parse(base64Decode(Item.data))
          Template = {...TemplateTemp, avatar: Item.avatar, name: Item.name, intro: Item.intro, type: Item.type, groupTwo: Item.groupTwo, permission: Item.permission}
        })
      }
    
      return Template
    }
    catch (error) {
      log('getAppById Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getAppByPublishId(id) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const idFilter = filterString(id)
      
      const PublishApp = await (getDbRecordALL)(`SELECT * from publish where _id = ?`, [idFilter]);
      if(PublishApp && PublishApp[0] && PublishApp[0].appId)  {
        const appid = PublishApp[0].appId
        const userId = PublishApp[0].userId
        const SettingRS = await (getDbRecordALL)(`SELECT data from app where _id = ? and userId = ? `, [appid, userId]);
        let Template = {}
        if(SettingRS)  {
          SettingRS.map((Item)=>{
            Template = JSON.parse(base64Decode(Item.data))
          })
        }
        return {...Template, PublishApp: PublishApp[0]}
      }
      else {
        return {}
      }
    }
    catch (error) {
      log('getAppByPublishId Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getAppPage(pageid, pagesize, userId) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
      try{
      const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
      const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
      const From = pageidFiler * pagesizeFiler;
      console.log("pageidFiler", pageidFiler)
      console.log("pagesizeFiler", pagesizeFiler)

      const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from app where userId = ?", [userId]);
      const RecordsTotal = Records ? Records.NUM : 0;  
      const RecordsAll = await (getDbRecordALL)(`SELECT * from app where userId = ? order by id desc limit ? OFFSET ? `, [userId, pagesizeFiler, From]);
      
      const RS = {};
      RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
      RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
      RS['from'] = From;
      RS['pageid'] = pageidFiler;
      RS['pagesize'] = pagesizeFiler;
      RS['total'] = RecordsTotal;

      return RS;
    }
    catch (error) {
      log('getAppPage Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getAppPageAll(pageid, pagesize, data) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
      const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
      const From = pageidFiler * pagesizeFiler;
      console.log("getAppPageAll************", data)
      console.log("pagesizeFiler", pagesizeFiler)

      let Records = null;
      let RecordsAll = []
      if(data && (data.name || data.intro)) {
        Records = await (getDbRecord)(`
                        SELECT COUNT(*) AS NUM
                        FROM app 
                        WHERE name LIKE '%' || ? || '%' 
                        AND intro LIKE '%' || ? || '%' 
                      `, [data.name || '', data.intro || ''])
        RecordsAll = await (getDbRecordALL)(`
                        SELECT *
                        FROM app 
                        WHERE name LIKE '%' || ? || '%' 
                        AND intro LIKE '%' || ? || '%' 
                        ORDER BY id DESC 
                        LIMIT ? OFFSET ?
                      `, [data.name || '', data.intro || '', pagesizeFiler, From]) || [];
      }
      else {
        Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from app where permission = ? ", ['public']);
        RecordsAll = await (getDbRecordALL)(`SELECT * from app where permission = ? order by id desc limit ? OFFSET ? `, ['public', pagesizeFiler, From]);
      }
      const RecordsTotal = Records ? Records.NUM : 0;  
      
      const RS = {};
      RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
      RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
      RS['from'] = From;
      RS['pageid'] = pageidFiler;
      RS['pagesize'] = pagesizeFiler;
      RS['total'] = RecordsTotal;

      return RS;
    }
    catch (error) {
      log('getAppPageAll Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getChatlogPageByApp(appId, pageid, pagesize, userId) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const appIdFileter = filterString(appId)
      const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
      const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
      const From = pageidFiler * pagesizeFiler;
      console.log("pageidFiler", pageidFiler)
      console.log("pagesizeFiler", pagesizeFiler)

      const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from appchatlog where appId = ? and userId = ?", [appIdFileter, userId]);
      const RecordsTotal = Records ? Records.NUM : 0;  
      const RecordsAll = await (getDbRecordALL)(`SELECT * from appchatlog where appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [appIdFileter, userId, pagesizeFiler, From]);
      
      const RS = {};
      RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
      RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
      RS['from'] = From;
      RS['pageid'] = pageidFiler;
      RS['pagesize'] = pagesizeFiler;
      RS['total'] = RecordsTotal;

      return RS;
    }
    catch (error) {
      log('getChatlogPageByApp Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getChatlogStaticPageByApp(appId, pageid, pagesize) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const appIdFileter = filterString(appId)
      const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
      const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
      const From = pageidFiler * pagesizeFiler;
      console.log("pageidFiler", pageidFiler)
      console.log("pagesizeFiler", pagesizeFiler)

      const Records = await (getDbRecord)("SELECT COUNT(DISTINCT userid) as totalRecords FROM chatlog WHERE appId = ?", [appIdFileter]);
      const RecordsTotal = Records ? Records.NUM : 0;  
      const RecordsAll = await (getDbRecordALL)(`select id, userid, count(*) as chatCount, publishId, timestamp from chatlog where appId = ? group by userid order by timestamp desc limit ? OFFSET ?`, [appIdFileter, pagesizeFiler, From]);

      const allPublishIdList = RecordsAll.map((item)=> item.publishId)
      const allPublishIdListNotNull = allPublishIdList.filter(item => item!=null && item!='')
      const RecordsAllPublish = await (getDbRecordALL)(`select name, _id from publish where _id IN (${allPublishIdListNotNull.map(() => '?').join(', ')})`, [...allPublishIdListNotNull]);
      const RecordsAllPublishMap = {}
      RecordsAllPublish.map((item)=>{
        RecordsAllPublishMap[item._id] = item.name
      })
      console.log("RecordsAllPublish", RecordsAllPublishMap)

      const RecordsAllFilter = RecordsAll.map((item)=>{
        return {...item, publishName: RecordsAllPublishMap[item.publishId] || ''}
      })
      
      const RS = {};
      RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
      RS['data'] = RecordsAllFilter;
      RS['from'] = From;
      RS['pageid'] = pageidFiler;
      RS['pagesize'] = pagesizeFiler;
      RS['total'] = RecordsTotal;

      return RS;
    }
    catch (error) {
      log('getChatlogStaticPageByApp Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }
  
  export async function getPublishsPageByApp(appId, pageid, pagesize, userId) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const appIdFileter = filterString(appId)
      const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
      const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
      const From = pageidFiler * pagesizeFiler;
      console.log("pageidFiler", pageidFiler)
      console.log("pagesizeFiler", pagesizeFiler)

      const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from publish where appId = ? and userId = ?", [appIdFileter, userId]);
      const RecordsTotal = Records ? Records.NUM : 0;  
      const RecordsAll = await (getDbRecordALL)(`SELECT * from publish where appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [appIdFileter, userId, pagesizeFiler, From]);
      
      const RS = {};
      RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
      RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
      RS['from'] = From;
      RS['pageid'] = pageidFiler;
      RS['pagesize'] = pagesizeFiler;
      RS['total'] = RecordsTotal;

      return RS;
    }
    catch (error) {
      log('getPublishsPageByApp Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function getPublishsAll(pageid, pagesize) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
    try{
      const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
      const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
      const From = pageidFiler * pagesizeFiler;
      console.log("pageidFiler", pageidFiler)
      console.log("pagesizeFiler", pagesizeFiler)

      let Records = null;
      let RecordsTotal = Records ? Records.NUM : 0;  
      let RecordsAll = [];
      Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from publish");
      RecordsTotal = Records ? Records.NUM : 0;  
      RecordsAll = await (getDbRecordALL)(`SELECT * from publish order by id desc limit ? OFFSET ? `, [pagesizeFiler, From]);
      
      const RS = {};
      RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
      RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
      RS['from'] = From;
      RS['pageid'] = pageidFiler;
      RS['pagesize'] = pagesizeFiler;
      RS['total'] = RecordsTotal;

      return RS;
    }
    catch (error) {
      log('getPublishsAll Error', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function addPublish(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
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

      const Records = await (getDbRecord)("SELECT id from publish where _id = ?", [Params._id]);
      const RecordId = Records ? Records.id : 0;

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
        log(Params._id, 'addPublish', Params.userId, 'Success addPublish:', JSON.stringify(Params));
        return {"status":"ok", "msg":"Add Success"}
      }
    }
    catch (error) {
      log(Params._id, 'addPublish', Params.userId, 'Error addPublish:', error.message);
      return {"status":"error", "msg":error.message}
    }
  }

  export async function editPublish(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
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
      log(Params._id, 'editPublish', Params.userId, 'Success editPublish:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Update Success"}
    }
    catch (error) {
      log(Params._id, 'editPublish', Params.userId,'Error editPublish:', error.message);
      return {"status":"error", "msg":error.message}
    }
    
  }

  export async function deletePublish(Params) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    try{
      Params._id = filterString(Params._id)
      Params.appId = filterString(Params.appId)
      Params.userId = filterString(Params.userId)
      const updateSetting = db.prepare('delete from publish where _id = ? and appId = ? and userId = ?');
      updateSetting.run(Params._id, Params.appId, Params.userId);
      updateSetting.finalize();
      log(Params._id, 'deletePublish', Params.userId, 'Success deletePublish:', JSON.stringify(Params));
      return {"status":"ok", "msg":"Delete Success"}
    }
    catch (error) {
      log(Params._id, 'deletePublish', Params.userId,'Error deletePublish:', error.message);
      return {"status":"error", "msg":error.message}
    }  
    
  }
  
  export async function getPublish(id, userId) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    const idFilter = filterString(id)
    const userIdFilter = Number(userId)
    
    const SettingRS = await (getDbRecordALL)(`SELECT data from publish where _id = ? and userId = ? `, [idFilter, userIdFilter]);
    
    let Template = {}
    if(SettingRS)  {
      SettingRS.map((Item)=>{
        Template = JSON.parse(Item.data)
      })
    }
  
    return Template
  }

  export async function getChatLogByAppIdAndUserId(appId, userId, pageid, pagesize) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    const appIdFiler = filterString(appId);
    const userIdFiler = filterString(userId);
    const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
    const From = pageidFiler * pagesizeFiler;

    console.log("appIdFiler", appIdFiler, userIdFiler)
  
    const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from chatlog where current = 1 and appId = ? and userId = ?", [appIdFiler, userIdFiler]);
    const RecordsTotal = Records ? Records.NUM : 0;
    const RecordsAll = await (getDbRecordALL)(`SELECT * from chatlog where current = 1 and  appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [appIdFiler, userIdFiler, pagesizeFiler, From]);
  
    const RS = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;
  
    return RS;
  }

  export async function deleteUserLogByAppId(appId, userId) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    const UpdateChatLog = db.prepare("update chatlog set current = 0 where appId = ? and userId = ?");
    UpdateChatLog.run(appId, userId);
    UpdateChatLog.finalize();
    log(appId, 'deleteUserLogByAppId', userId, 'Success deleteUserLogByAppId:', JSON.stringify([]));
    return {"status":"ok", "msg":"Clear History Success"}
  }

  export async function deleteUserLogByChatlogId(appId, userId, id) {
    const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
    const UpdateChatLog = db.prepare("delete from chatlog where appId = ? and userId = ? and _id = ?");
    UpdateChatLog.run(appId, userId, id);
    UpdateChatLog.finalize();
    log(appId, 'deleteUserLogByChatlogId', userId, 'Success deleteUserLogByChatlogId:', JSON.stringify([]));
    return {"status":"ok", "msg":"Delete Success"}
  }