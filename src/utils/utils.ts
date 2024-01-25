import * as fs from 'fs';

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

function log(message: string): void {
  console.log(message);
}

