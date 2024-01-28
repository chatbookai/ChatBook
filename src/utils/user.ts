  import { setting, log } from './utils'
  import dotenv from 'dotenv';
  import { promisify } from 'util';
  import bcrypt from 'bcrypt';

  dotenv.config();

  const [db] = setting()

  const getDbRecord = promisify(db.get.bind(db));
  const getDbRecordALL = promisify(db.all.bind(db));


  const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  };

  const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  };

  const passwordValidator = (password: string): boolean => {

    // 正则表达式，要求至少包含一个数字、一个字母，且长度至少为八位
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
  
    return passwordRegex.test(password);
  };

  export async function checkUserPassword(email: string, userPassword: string) {
    const getOneUserData: any = getOneUser(email);
    if(getOneUserData) {
        const isPasswordMatch = await comparePasswords(userPassword, getOneUserData.password);
        if(isPasswordMatch) {
            return {"status":"ok", "msg":"Login successful"}
        }
        else {
            return {"status":"error", "msg":"Username not exist or password is error"}
        }
    }
    else {
        return {"status":"error", "msg":"Username not exist or password is error"}
    }
  }

  export async function changeUserPassword(email: string, oldPassword: string, password: string, confirm_password: string) {
    const getOneUserData: any = getOneUser(email);
    if(getOneUserData) {
        const isPasswordMatch = await comparePasswords(oldPassword, getOneUserData.password);
        if(isPasswordMatch) {
            if(password != confirm_password) {

                return {"status":"error", "msg":"The passwords entered twice are different"}
            }
            if(!passwordValidator(password)) {
    
                return {"status":"error", "msg":"The password must contain both letters and numbers, and be at least 8 characters long."}
            }
            const hashedPassword = await hashPassword(password);
            const updateSetting = db.prepare('update user set password = ? where email = ?)');
            updateSetting.run(hashedPassword, email);
            updateSetting.finalize();

            // User password change log
            // ...
        }
        else {
            return {"status":"error", "msg":"Username not exist or password is error"}
        }
    }
    else {
        return {"status":"error", "msg":"Username not exist or password is error"}
    }
  }

  export async function changeUserDetail(email: string) {
    const getOneUserData: any = getOneUser(email);
    if(getOneUserData) {
    }
    else {
        return {"status":"error", "msg":"Username not exist or password is error"}
    }
  }

  export async function registerUser(email: string, username: string, password: string, confirm_password: string, language: string) {
    try{
        if(password != confirm_password) {

            return {"status":"error", "msg":"The passwords entered twice are different"}
        }
        if(!passwordValidator(password)) {

            return {"status":"error", "msg":"The password must contain both letters and numbers, and be at least 8 characters long."}
        }
        const hashedPassword = await hashPassword(password);
        const insertSetting = db.prepare('INSERT OR IGNORE INTO user (email, username, password, language, createtime) VALUES (?, ?, ?, ?, ?)');
        insertSetting.run(email, username, hashedPassword, language, Date.now());
        insertSetting.finalize();
    }
    catch (error: any) {
      log('Error registerUser:', error.message);
    }
    return {"status":"ok", "msg":"Register user successful"}
  }

  export async function getOneUser(email: string) {
    const Records: any = await getDbRecord("SELECT * from user where email = ? ", [email]);
 
    return Records ? Records : null;
  }

  export async function getUsers(pageid: number, pagesize: number) {
    const user_status = 1;
    const pageidFiler = Number(pageid) < 0 ? 0 : Number(pageid) || 0;
    const pagesizeFiler = Number(pagesize) < 5 ? 5 : Number(pagesize) || 5;
    const From = pageidFiler * pagesizeFiler;
    console.log("pageidFiler", pageidFiler)
    console.log("pagesizeFiler", pagesizeFiler)

    const Records: any = await getDbRecord("SELECT COUNT(*) AS NUM from user where user_status = ? ", [user_status]);
    const RecordsTotal: number = Records ? Records.NUM : 0;

    const RecordsAll: any[] = await getDbRecordALL(`SELECT * FROM user WHERE user_status = ? ORDER BY id DESC LIMIT ? OFFSET ? `, [user_status, pagesizeFiler, From]) || [];

    const RS: any = {};
    RS['allpages'] = Math.ceil(RecordsTotal/pagesizeFiler);
    RS['data'] = RecordsAll.filter(element => element !== null && element !== undefined && element !== '');
    RS['from'] = From;
    RS['pageid'] = pageidFiler;
    RS['pagesize'] = pagesizeFiler;
    RS['total'] = RecordsTotal;
  
    return RS;
  }

