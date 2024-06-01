import * as fs from 'fs'
import multer from 'multer'
import path from 'path'
import * as crypto from 'crypto'
import validator from 'validator';
import { randomBytes } from 'crypto';
import { ChatBookDbPool } from './db.js'
import iconv from 'iconv-lite';


export function enableDir(directoryPath) {
  try {
    fs.accessSync(directoryPath, fs.constants.F_OK);
  } 
  catch (err) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } 
    catch (err) {
      console.log(`Error creating directory ${directoryPath}: ${err.message}`);
      throw err;
    }
  }
}

export async function getLLMSSetting(datasetId) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const datasetIdFilter = filterString(datasetId)
  
  const RecordsAll = await (getDbRecordALL)(`SELECT name,content from setting where type='openaisetting' and datasetId = ? `, [datasetIdFilter]);
  const OpenAISetting = {}
  if(RecordsAll)  {
    RecordsAll.map((Item)=>{
      OpenAISetting[Item.name] = Item.content
    })
  }

  return OpenAISetting
}

export async function setOpenAISetting(Params) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
  const datasetIdFilter = filterString(Params.datasetId)
  const userIdFilter = filterString(Params.userId)
  try {
    const insertSetting = db.prepare('INSERT OR REPLACE INTO setting (name, content, type, datasetId, userId) VALUES (?, ?, ?, ?, ?)');
    insertSetting.run('OPENAI_API_BASE', Params.OPENAI_API_BASE, 'openaisetting', datasetIdFilter, userIdFilter);
    insertSetting.run('OPENAI_API_KEY', Params.OPENAI_API_KEY, 'openaisetting', datasetIdFilter, userIdFilter);
    insertSetting.run('Temperature', Params.Temperature, 'openaisetting', datasetIdFilter, userIdFilter);
    insertSetting.run('ModelName', Params.ModelName, 'openaisetting', datasetIdFilter, userIdFilter);
    insertSetting.run('Prompt', Params.Prompt, 'openaisetting', datasetIdFilter, userIdFilter);
    insertSetting.finalize();
  }
  catch (error) {
    console.log('Error setOpenAISetting:', error.message);
  }

  return {"status":"ok", "msg":"Update Success"}
}

export async function getTemplate(datasetId, userId) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
  const datasetIdFilter = filterString(datasetId)
  const userIdFilter = Number(userId)
  
  const SettingRS = await (getDbRecordALL)(`SELECT name,content from setting where type='TEMPLATE' and datasetId = ? and userId = ? `, [datasetIdFilter, userIdFilter]);
  
  const Template = {}
  if(SettingRS)  {
    SettingRS.map((Item)=>{
      Template[Item.name.replace("_" + String(datasetIdFilter),"")] = Item.content
    })
  }

  return Template
}

export async function setTemplate(Params) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()
  
  try{
    const datasetIdFilter = Number(Params.datasetId)
    const userIdFilter = Params.userId
    const Templatename = "TEMPLATE"
    const insertSetting = db.prepare('INSERT OR REPLACE INTO setting (name, content, type, datasetId, userId) VALUES (?, ?, ?, ?, ?)');
    insertSetting.run('CONDENSE_TEMPLATE', Params.CONDENSE_TEMPLATE, Templatename, datasetIdFilter, userIdFilter);
    insertSetting.run('QA_TEMPLATE', Params.QA_TEMPLATE, Templatename, datasetIdFilter, userIdFilter);
    insertSetting.finalize();
  }
  catch (error) {
    console.log('Error setTemplate:', error.message);
  }

  return {"status":"ok", "msg":"Update Success"}
}

export function uploadfiles() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DataDir + '/uploadfiles/'); // 设置上传文件保存的目录
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export function uploadavatar() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DataDir + '/avatarforapp/'); // 设置上传文件保存的目录
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      console.log("uploadavatar FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export function uploadAvatarForDataset() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DataDir + '/avatarfordataset/'); // 设置上传文件保存的目录
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      console.log("uploadAvatarForDataset FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export function uploadImageForVideo() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DataDir + '/imageforvideo/'); // 设置上传文件保存的目录
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      console.log("uploadImageForVideo FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export function uploadImageForImageGenerateImage() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DataDir + '/imageforimage/'); // 设置上传文件保存的目录
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const FileNameNew = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
      console.log("uploadImageForImageGenerateImage FileNameNew", FileNameNew)
    },
  });
  const upload = multer({ storage: storage });

  return upload
}

export async function uploadfilesInsertIntoDb(files, datasetId, userId) {
  const filesInfo = files.map((file) => {
    const filePath = path.join(DataDir, 'uploadfiles', file.filename);
    const fileHash = calculateFileHashSync(filePath);
    const originalName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8');
    return {
      originalName: originalName,
      newName: file.filename,
      fileHash: fileHash,
    };
  });
  console.log("filesInfo", filesInfo, datasetId, userId)
  const insertCollection = db.prepare('INSERT OR IGNORE INTO collection (_id, datasetId, type, name, content, suffixName, newName, originalName, fileHash, status, timestamp, userId, data, dataTotal, folder, updateTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  filesInfo.map((Item)=>{
    const suffixName = path.extname(Item.originalName).toLowerCase();
    insertCollection.run(getNanoid(32), datasetId, 'File', Item.originalName, '', suffixName, Item.newName, Item.originalName, Item.fileHash, 0, Date.now(), Number(userId), '', '', '', '');
  })
  insertCollection.finalize();
  
}

export async function getFilesPage(pageid, pagesize) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
  const From = pageidFiler * pagesizeFiler;
  
  const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from files");
  const RecordsTotal = Records ? Records.NUM : 0;  
  const RecordsAll = await (getDbRecordALL)(`SELECT * from files where 1=1 order by status desc, timestamp desc limit ? OFFSET ? `, [pagesizeFiler, From]);
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
    
    //log("getFilesPage", RSDATA)
  }
  const RS = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getFilesDatasetId(datasetId, pageid, pagesize) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const datasetIdFiler = Number(datasetId) < 0 ? 0 : datasetId;
  const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
  const From = pageidFiler * pagesizeFiler;
  
  
  const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from files where datasetId = ?", [datasetIdFiler]);
  const RecordsTotal = Records ? Records.NUM : 0;  
  const RecordsAll = await (getDbRecordALL)(`SELECT * from files where datasetId = ? order by status desc, timestamp desc limit ? OFFSET ? `, [datasetIdFiler, pagesizeFiler, From]);

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
  const RS = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RSDATA.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getFilesNotParsed() {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  
  const RecordsAll = await (getDbRecordALL)(`SELECT * from files where status = '0' order by timestamp asc limit 10 `);

  return RecordsAll;
}

export async function getChatLogByDatasetIdAndUserId(datasetId, userId, pageid, pagesize) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const datasetIdFiler = filterString(datasetId);
  const userIdFiler = Number(userId) < 0 ? 0 : userId;
  const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
  const From = pageidFiler * pagesizeFiler;

  
  const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from chatlog where current = 1 and appId = ? and userId = ?", [datasetIdFiler, userIdFiler]);
  const RecordsTotal = Records ? Records.NUM : 0;
  const RecordsAll = await (getDbRecordALL)(`SELECT * from chatlog where current = 1 and  appId = ? and userId = ? order by id desc limit ? OFFSET ? `, [datasetIdFiler, userIdFiler, pagesizeFiler, From]);

  const RS = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export async function getLogsPage(pageid, pagesize) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
  const From = pageidFiler * pagesizeFiler;

  
  const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from logs ");
  const RecordsTotal = Records ? Records.NUM : 0;  
  const RecordsAll = await (getDbRecordALL)(`SELECT * from logs order by id desc limit ? OFFSET ? `, [pagesizeFiler, From]);
  
  const RS = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export function timestampToDate(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function log(appId, publishId, userId, Action1, Action2, Action3, Action4, Action5, Action6, Action7, Action8, Action9, Action10) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const currentDate = new Date();
  const currentDateTime = currentDate.toLocaleString();
  const content = JSON.stringify(Action1) +" "+ JSON.stringify(Action2) +" "+ JSON.stringify(Action3) +" "+ JSON.stringify(Action4) +" "+ JSON.stringify(Action5) +" "+ JSON.stringify(Action6) +" "+ JSON.stringify(Action7) +" "+ JSON.stringify(Action8) +" "+ JSON.stringify(Action9) +" "+ JSON.stringify(Action10);
  const insertStat = db.prepare('INSERT OR REPLACE INTO logs (datetime, content, appId, publishId, userId) VALUES (? ,? ,? ,? ,?)');
  insertStat.run(currentDateTime, content, appId, publishId, userId);
  insertStat.finalize();
  console.log(userId, Action1, Action2, Action3, Action4, Action5, Action6, Action7, Action8, Action9, Action10)
}

export async function deleteLog() {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const Records = await (getDbRecord)("SELECT MAX(id) AS NUM FROM logs");
  const MaxId = Records ? Records.NUM : 0;
  if(MaxId > 1000) {
    const DeleteId = MaxId - 1000;
    const DeleteLog = db.prepare("delete from logs where id < ?");
    DeleteLog.run(DeleteId);
    DeleteLog.finalize();
  }
}

export async function clearShortLogs() {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const DeleteLog = db.prepare("delete from logs where length(content) < 50");
  DeleteLog.run();
  DeleteLog.finalize();
  return {"status":"ok", "msg":"Deleted Success"}
}

export async function clearAllLogs() {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const DeleteLog = db.prepare("delete from logs");
  DeleteLog.run();
  DeleteLog.finalize();
  return {"status":"ok", "msg":"Deleted Success"}
}

export async function deleteUserLogByDatasetId(datasetId, userId) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const UpdateChatLog = db.prepare("update chatlog set current = 0 where appId = ? and userId = ?");
  UpdateChatLog.run(datasetId, userId);
  UpdateChatLog.finalize();
  return {"status":"ok", "msg":"Clear History Success"}
}

export function calculateFileHashSync(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileContent);

    return hash.digest('hex');
  } 
  catch (error) {
    throw error;
  }
}

export function readFile(Dir, FileName, Mark, OpenFormat) {
  const filePath = DataDir + '/' + Dir + '/' + FileName;
  if(isFile(filePath)) {
    console.log("filePath", filePath)
    const data = fs.readFileSync(filePath, OpenFormat);

    return data;
  }
  else {
    console.log("[" + Mark + "] Error read file:", filePath);

    return null;
  }
}

export function writeFile(Dir, FileName, FileContent, Mark) {
  const directoryPath = DataDir + '/' + Dir;
  enableDir(directoryPath)
  const TxFilePath = directoryPath + "/" + FileName
  try {
    fs.writeFileSync(TxFilePath, FileContent);

    return true;
  } 
  catch (err) {
    console.log("[" + Mark + "] Error writing to file:", err);

    return false;
  }
}

export function filterString(input) {
  console.log("filterString input:", input)
  if(input == undefined)              {

    return '';
  }
  else if (typeof input === 'number') {

    return input;
  } 
  else if (typeof input === 'string') {

    return input;
  } else {

    return input;
  }
}

export function copyFileSync(source, destination) {
  try {
    const content = fs.readFileSync(source);
    fs.writeFileSync(destination, content);
    console.log('0', 'File copied successfully!');

    return true;
  } 
  catch (error) {
    console.log('0', 'Error copying file:', error);

    return false;
  }
}

export function isFile(filePath) {
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

export function formatDateFromTimestamp(timestamp) {
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

export function formatDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function formatDateString(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}${month}${day}`;

  return formattedDate;
}

export const isEmailValid = (email) => {
  return validator.isEmail(email);
};

export async function wholeSiteStatics() {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const NewUserPerDayData = await (getDbRecordALL)(`SELECT strftime('%Y-%m-%d', datetime(createtime / 1000, 'unixepoch')) AS date, count(*) AS NUM from user group by date order by date asc`);
  const NewUserPerDay = NewUserPerDayData.map(Item => Item.NUM)

  const NewImagesPerDayData = await (getDbRecordALL)(`SELECT strftime('%Y-%m-%d', datetime(createtime / 1000, 'unixepoch')) AS date, count(*) AS NUM from userimages group by date order by date asc`);
  const NewImagesPerDay = NewImagesPerDayData.map(Item => Item.NUM)

  const NewFilesPerDayData = await (getDbRecordALL)(`SELECT strftime('%Y-%m-%d', datetime(timestamp / 1000, 'unixepoch')) AS date, count(*) AS NUM from files group by date order by date asc`);
  const NewFilesPerDay = NewFilesPerDayData.map(Item => Item.NUM)

  const NewActivitesPerDayData = await (getDbRecordALL)(`SELECT strftime('%Y-%m-%d', datetime(timestamp / 1000, 'unixepoch')) AS date, count(*) AS NUM from chatlog group by date order by date asc`);
  const NewActivitesPerDay = NewActivitesPerDayData.map(Item => Item.NUM)

  const DateListData = await (getDbRecordALL)(`SELECT distinct strftime('%Y-%m-%d', datetime(timestamp / 1000, 'unixepoch')) AS date from chatlog order by date asc`);
  const DateList = DateListData.map(Item => Item.date)

  const Records1 = await (getDbRecord)("SELECT COUNT(*) AS NUM from userimages");
  const TotalImages = Records1 ? Records1.NUM : 0;

  const Records2 = await (getDbRecord)("SELECT COUNT(*) AS NUM from chatlog");
  const TotalActivites = Records2 ? Records2.NUM : 0;

  const Records3 = await (getDbRecord)("SELECT COUNT(*) AS NUM from user");
  const TotalUsers = Records3 ? Records3.NUM : 0;

  const Records4 = await (getDbRecord)("SELECT COUNT(*) AS NUM from files");
  const TotalFiles = Records4 ? Records4.NUM : 0;

  return {NewUserPerDay, NewImagesPerDay, NewFilesPerDay, NewActivitesPerDay, DateList, TotalImages, TotalActivites, TotalUsers, TotalFiles}
}

export async function getAllImages(userId, pageid, pagesize) {
  const { DataDir, db, getDbRecord, getDbRecordALL } = ChatBookDbPool()

  const pageidFiler = Number(pageid) < 0 ? 0 : pageid;
  const pagesizeFiler = Number(pagesize) < 5 ? 5 : pagesize;
  const From = pageidFiler * pagesizeFiler;
  console.log("pageidFiler", pageidFiler)
  console.log("pagesizeFiler", pagesizeFiler)

  const Records = await (getDbRecord)("SELECT COUNT(*) AS NUM from userimages where 1=1 ");
  const RecordsTotal = Records ? Records.NUM : 0;

  const RecordsAll = await (getDbRecordALL)("SELECT * FROM userimages where 1=1 ORDER BY id DESC LIMIT ? OFFSET ? ", [pagesizeFiler, From]) || [];

  const RecordsIdList = RecordsAll.map(element => element.id);

  //Get Favorite Data
  let Favorite = {}
  if(userId)  {
    const RecordsFavorite = await (getDbRecordALL)("SELECT * FROM userimagefavorite WHERE imageId IN (" + RecordsIdList.map(() => "?").join(",") + ") and userId = ? and status = 1 order by id asc", [...RecordsIdList, userId]) || [];
    RecordsFavorite.map((Item)=>{
      Favorite[Item.imageId] = 1
    })
  }

  const RS = {};
  RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
  RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
  RS['favorite'] = Favorite
  RS['from'] = From;
  RS['pageid'] = pageidFiler;
  RS['pagesize'] = pagesizeFiler;
  RS['total'] = RecordsTotal;

  return RS;
}

export function filterNegativePrompt(Prompt) {
  const PromptNew = Prompt + ", ugly, poorly designed, amateur, bad proportions, direct sunlight, low quality, disfigured hands, poorly drawn face, out of frame, bad anatomy, signature, low contrast, overexposed, nsfw, weapon, blood, guro, without cloth, disturbing imagery, sexual violence, inappropriate attire, blurry, unfocused, unpleasant, unintelligible, offensive, distorted, unoriginal, uninspired, poor composition, boring, inconsistent style, low resolution, irrelevant"
  return removeDuplicates(PromptNew)
}

export function removeDuplicates(words) {
  const wordList = words.split(',');
  const uniqueWords = [];
  for (const word of wordList) {
    if (!uniqueWords.includes(word.trim())) {
      uniqueWords.push(word.trim());
    }
  }
  return uniqueWords.join(',');
}

export const getNanoid = (size = 12) => {
  const bytes = randomBytes(16);
  const hexString = bytes.toString('hex');
  return hexString.slice(0, size);
};