import * as fs from 'fs'
import multer from 'multer'
import path from 'path'
import * as crypto from 'crypto'
import sqlite3 from 'sqlite3';

const DataDir = "./data"
const userId = 1

// @ts-ignore
const db: any = new sqlite3.Database(DataDir + '/ChatBookSqlite3.db', { encoding: 'utf8' });

export function setting() {
  return [DataDir, db, userId]
}

export function enableDir(directoryPath: string): void {
  try {
    fs.accessSync(directoryPath, fs.constants.F_OK);
  } 
  catch (err: any) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } 
    catch (err: any) {
      log(`Error creating directory ${directoryPath}: ${err.message}`);
      throw err;
    }
  }
}

export async function getLLMSSetting(knowledgeId: number | string) {
  const knowledgeIdFilter = filterString(knowledgeId)
  const userIdFilter = Number(userId)
  const SettingRS: any[] = await new Promise((resolve, reject) => {
          db.all("SELECT name,content from setting where type='openaisetting' and knowledgeId='"+knowledgeIdFilter+"' and userId='"+userIdFilter+"'", (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result ? result : null);
            }
          });
        });
  const OpenAISetting: any = {}
  if(SettingRS)  {
    SettingRS.map((Item: any)=>{
      OpenAISetting[Item.name] = Item.content
    })
  }

  return OpenAISetting
}

export async function setOpenAISetting(Params: any) {
  const knowledgeIdFilter = filterString(Params.knowledgeId)
  const userIdFilter = Number(userId)
  try {
    const insertSetting = db.prepare('INSERT OR REPLACE INTO setting (name, content, type, knowledgeId, userId) VALUES (?, ?, ?, ?, ?)');
    insertSetting.run('OPENAI_API_BASE', Params.OPENAI_API_BASE, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.run('OPENAI_API_KEY', Params.OPENAI_API_KEY, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.run('Temperature', Params.Temperature, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.run('ModelName', Params.ModelName, 'openaisetting', knowledgeIdFilter, userIdFilter);
    insertSetting.finalize();
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export async function getTemplate(knowledgeId: number | string) {
  const knowledgeIdFilter = filterString(knowledgeId)
  const userIdFilter = Number(userId)
  const SettingRS: any[] = await new Promise((resolve, reject) => {
          const Templatename = "TEMPLATE"
          db.all("SELECT name,content from setting where type='"+Templatename+"' and knowledgeId='"+knowledgeIdFilter+"' and userId='"+userIdFilter+"'", (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result ? result : null);
            }
          });
        });
  const Template: any = {}
  if(SettingRS)  {
    SettingRS.map((Item: any)=>{
      Template[Item.name.replace("_" + String(knowledgeIdFilter),"")] = Item.content
    })
  }

  return Template
}

export async function setTemplate(Params: any) {
  try{
    const knowledgeIdFilter = Number(Params.knowledgeId)
    const userIdFilter = Number(userId)
    const Templatename = "TEMPLATE"
    const insertSetting = db.prepare('INSERT OR REPLACE INTO setting (name, content, type, knowledgeId, userId) VALUES (?, ?, ?, ?, ?)');
    insertSetting.run('CONDENSE_TEMPLATE', Params.CONDENSE_TEMPLATE, Templatename, knowledgeIdFilter, userIdFilter);
    insertSetting.run('QA_TEMPLATE', Params.QA_TEMPLATE, Templatename, knowledgeIdFilter, userIdFilter);
    insertSetting.finalize();
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export async function addKnowledge(Params: any) {
  try{
    const userIdFilter = Number(userId)
    Params.name = filterString(Params.name)
    Params.summary = filterString(Params.summary)
    const RecordId = await new Promise((resolve, reject) => {
      db.get("SELECT id from knowledge where name = '"+filterString(Params.name)+"' and userId = '"+userIdFilter+"'", (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result ? result.id : null);
        }
      });
    });
    console.log("RecordId", RecordId, userId)
    if(RecordId) {
      Params.id = RecordId
      setKnowledge(Params)
    }
    else {
      const insertSetting = db.prepare('INSERT OR REPLACE INTO knowledge (name, summary, timestamp, userId) VALUES (?, ?, ?, ?)');
      insertSetting.run(Params.name, Params.summary, Date.now(), userIdFilter);
      insertSetting.finalize();
    }
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export async function setKnowledge(Params: any) {
  try{
    Params.id = Number(Params.id)
    Params.name = filterString(Params.name)
    Params.summary = filterString(Params.summary)
    const updateSetting = db.prepare('update knowledge set name = ?, summary = ?, timestamp = ? where id = ?');
    updateSetting.run(Params.name, Params.summary, Date.now(), Params.id);
    updateSetting.finalize();
  }
  catch (error: any) {
    log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Updated Success"}
}

export function uploadfiles() {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, DataDir + '/uploadfiles/'); // 设置上传文件保存的目录
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      
      //const absolutePath = path.resolve('uploadfiles', FileNameNew);
      //const calculateFileHash = calculateFileHashSync(absolutePath);
      
      log("FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export async function uploadfilesInsertIntoDb(files: any[], knowledgeId: number | string) {
  //const originalName = Buffer.from(files[0].originalname, 'hex').toString('utf8');
  //log("originalName", files[0].originalname)
  const filesInfo = files.map((file: any) => {
    const filePath = path.join(DataDir, 'uploadfiles', file.filename);
    const fileHash = calculateFileHashSync(filePath);

    return {
      originalName: file.originalname,
      newName: file.filename,
      hash: fileHash,
    };
  });
  const insertFiles = db.prepare('INSERT OR IGNORE INTO files (knowledgeId: number | string, suffixName, newName, originalName, hash, timestamp, userId) VALUES (?,?,?,?,?,?,?)');
  filesInfo.map((Item: any)=>{
    const suffixName = path.extname(Item.originalName).toLowerCase();
    insertFiles.run(knowledgeId, suffixName, Item.newName, Item.originalName, Item.hash, Date.now(), Number(userId));
    
    // Move Files To knowledgeId Dir
    enableDir(DataDir + '/uploadfiles/' + String(userId) )
    enableDir(DataDir + '/uploadfiles/' + String(userId) + '/' + String(knowledgeId))
    fs.rename(DataDir + '/uploadfiles/' + Item.newName, DataDir + '/uploadfiles/'  + String(userId) + '/' + String(knowledgeId) + '/' + Item.newName, (err: any) => {
      if (err) {
        log('Error moving file:', err, Item);
      } else {
        log('File moved successfully.', Item);
      }
    });
  })
  insertFiles.finalize();
}

export async function getFilesPage(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  const RecordsTotal: number = await new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS NUM from files", (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result ? result.NUM : null);
      }
    });
  });
  const RecordsAll: any[] = await new Promise((resolve, reject) => {
                          db.all("SELECT * from files where 1=1 order by status desc, timestamp desc limit "+ Number(pagesize) +" offset "+ From +"", (err: any, result: any) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(result ? result : null);
                            }
                          });
                        });
  let RSDATA: any[] = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item: any)=>{
          let ItemStatus = "Ready To Parse"
          switch(Item.status) {
            case 1:
              ItemStatus = 'Finished'
              break;
            case -1:
              ItemStatus = 'File Not Exist'
              break;
          }

          return {...Item, status:ItemStatus, timestamp: formatDateFromTimestamp(Item.timestamp)}
        })
    );
    log("getFilesPage", RSDATA)
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getFilesKnowledgeId(knowledgeId: number | string, pageid: number, pagesize: number) {
  const KnowledgeIdFiler = Number(knowledgeId) < 0 ? 0 : Number(knowledgeId);
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  const RecordsTotal: number = await new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS NUM from files where knowledgeId = '"+KnowledgeIdFiler+"'", (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result ? result.NUM : null);
      }
    });
  });
  const RecordsAll: any[] = await new Promise((resolve, reject) => {
                          db.all("SELECT * from files where knowledgeId = '"+KnowledgeIdFiler+"' order by status desc, timestamp desc limit "+ Number(pagesize) +" offset "+ From +"", (err: any, result: any) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(result ? result : null);
                            }
                          });
                        });
  let RSDATA = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item)=>{
          let ItemStatus = "Ready To Parse"
          switch(Item.status) {
            case 1:
              ItemStatus = 'Finished'
              break;
            case -1:
              ItemStatus = 'File Not Exist'
              break;
          }

          return {...Item, status:ItemStatus, timestamp: formatDateFromTimestamp(Item.timestamp)}
        })
    );
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getChatLogByKnowledgeIdAndUserId(knowledgeId: number | string, userId: number, pageid: number, pagesize: number) {
  const KnowledgeIdFiler = filterString(knowledgeId);
  const userIdFiler = Number(userId) < 0 ? 0 : Number(userId) || 1;
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  const RecordsTotal: number = await new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS NUM from chatlog where knowledgeId = '"+KnowledgeIdFiler+"' and userId = '"+userIdFiler+"'", (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result ? result.NUM : null);
      }
    });
  });
  const RecordsAll: any[] = await new Promise((resolve, reject) => {
                          db.all("SELECT * from chatlog where knowledgeId = '"+KnowledgeIdFiler+"' and userId = '"+userIdFiler+"' order by timestamp desc limit "+ Number(pagesize) +" offset "+ From +"", (err: any, result: any) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(result ? result : null);
                            }
                          });
                        });
  let RSDATA = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item)=>{

          return Item
        })
    );
    log("getChatLogByKnowledgeIdAndUserId", RSDATA)
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getLogsPage(pageid: number, pagesize: number) {
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  const RecordsTotal: number = await new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS NUM from logs", (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result ? result.NUM : null);
      }
    });
  });
  const RecordsAll: any[] = await new Promise((resolve, reject) => {
                          db.all("SELECT * from logs where 1=1 order by id desc limit "+ pagesizeFiler +" offset "+ From +"", (err: any, result: any) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(result ? result : null);
                            }
                          });
                        });
  let RSDATA = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item)=>{

          return Item
        })
    );
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getKnowledgePage(pageid: number, pagesize: number) {
  const userIdFiler = Number(userId) < 0 ? 0 : Number(userId) || 1;
  const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)
  const RecordsTotal: number = await new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS NUM from knowledge where userId='"+userIdFiler+"'", (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result ? result.NUM : null);
      }
    });
  });
  const RecordsAll: any[] = await new Promise((resolve, reject) => {
                          db.all("SELECT * from knowledge where userId='"+userIdFiler+"' order by id desc limit "+ pagesizeFiler +" offset "+ From +"", (err: any, result: any) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(result ? result : null);
                            }
                          });
                        });
  let RSDATA = []
  if(RecordsAll != undefined) {
    RSDATA = await Promise.all(
      RecordsAll.map(async (Item)=>{

          return Item
        })
    );
  }
  const RS: any = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export function timestampToDate(timestamp: number | string) {
  const date = new Date(Number(timestamp) * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function log(Action1: string | any, Action2: string | any='', Action3: string | any='', Action4: string | any='', Action5: string | any='', Action6: string | any='', Action7: string | any='', Action8: string | any='', Action9: string | any='', Action10: string | any='') {
  const currentDate = new Date();
  const currentDateTime = currentDate.toLocaleString();
  const content = JSON.stringify(Action1) +" "+ JSON.stringify(Action2) +" "+ JSON.stringify(Action3) +" "+ JSON.stringify(Action4) +" "+ JSON.stringify(Action5) +" "+ JSON.stringify(Action6) +" "+ JSON.stringify(Action7) +" "+ JSON.stringify(Action8) +" "+ JSON.stringify(Action9) +" "+ JSON.stringify(Action10);
  const insertStat = db.prepare('INSERT OR REPLACE INTO logs (datetime, content, knowledgeId, userId) VALUES (? ,? ,? ,?)');
  insertStat.run(currentDateTime, content, 0, userId);
  insertStat.finalize();
  console.log(Action1, Action2, Action3, Action4, Action5, Action6, Action7, Action8, Action9, Action10)
}

export async function deleteLog() {
  const MaxId: number = await new Promise((resolve, reject) => {
    db.get("SELECT MAX(id) AS NUM FROM logs", (err: any, result: any) => {
      if (err) {
        reject(err);
      } 
      else {
        resolve(result ? result.NUM : null);
      }
    });
  });
  const DeleteId = MaxId - 1000;
  const DeleteLog = db.prepare("delete from logs where id < ?");
  DeleteLog.run(DeleteId);
  DeleteLog.finalize();
}

export async function GetSetting(Name: string, knowledgeId: number | string, userId: number) {

  return await new Promise((resolve, reject) => {
    db.get("SELECT content FROM setting where name='"+Name+"' and knowledgeId='"+knowledgeId+"' and userId='"+userId+"'", (err: any, result: any) => {
      if (err) {
        reject(err);
      } 
      else {
        resolve(result ? String(result.content) : '');
      }
    });
  });
}

function calculateFileHashSync(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileContent);

    return hash.digest('hex');
  } 
  catch (error: any) {
    throw error;
  }
}

export function readFile(Dir: string, FileName: string, Mark: string, OpenFormat: any) {
  const filePath = DataDir + '/' + Dir + '/' + FileName;
  if(isFile(filePath)) {
    log("filePath", filePath)
    const data = fs.readFileSync(filePath, OpenFormat);

    return data;
  }
  else {
    log("[" + Mark + "] Error read file:", filePath);

    return null;
  }
}

export function writeFile(Dir: string, FileName: string, FileContent: string, Mark: string) {
  const directoryPath = DataDir + '/' + Dir;
  enableDir(directoryPath)
  const TxFilePath = directoryPath + "/" + FileName
  try {
    fs.writeFileSync(TxFilePath, FileContent);

    return true;
  } 
  catch (err) {
    log("[" + Mark + "] Error writing to file:", err);

    return false;
  }
}

export function filterString(input: number | string) {
  log("filterString input:", input)
  if (typeof input === 'number') {

    return input;
  } 
  else if (typeof input === 'string') {

    return input;
  } else {

    return input;
  }
}

export function copyFileSync(source: string, destination: string) {
  try {
    const content = fs.readFileSync(source);
    fs.writeFileSync(destination, content);
    log('File copied successfully!');

    return true;
  } 
  catch (error: any) {
    log('Error copying file:', error);

    return false;
  }
}

export function isFile(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile() && stats.size > 0) {

      return true;
    } else {

      return false;
    }
  } 
  catch (err) {

    return false;
  }
}

export function formatDateFromTimestamp(timestamp: number | string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

