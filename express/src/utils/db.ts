// globals.ts
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { DataDir } from './const';

// @ts-ignore
export const db: sqlite3.Database = new sqlite3.Database(DataDir + '/ChatBookSqlite3.db', { encoding: 'utf8' });

export const getDbRecord = promisify(db.get.bind(db));
export const getDbRecordALL = promisify(db.all.bind(db));
