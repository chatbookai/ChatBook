import crypto from 'crypto';
import { OpenAI } from "openai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { LanceDB } from "@langchain/community/vectorstores/lancedb";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { connect } from "vectordb";
import { OpenAIEmbeddingFunction } from 'vectordb';
import { load, type Element } from 'cheerio';

import { DataDir } from './const';
import { db, getDbRecord, getDbRecordALL } from './db'

import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''

interface Entry {
    [x: string]: any
    link: string
    title: string;
    text: string
}

interface EntryWithContext {
    [x: string]: any
    link: string
    title: string;
    text: string
    context: string
}

export async function createEmbeddingsTable(WebsiteUrlList: string[], datasetId: string, _id: string) {
    const lance_db = await connect(DataDir + '/LanceDb/datasetId_' + datasetId + "/" + _id);
  
    const embedFunction = new OpenAIEmbeddingFunction('context', OPENAI_API_KEY)
    const data = contextualize(await getWebsiteUrlContent(WebsiteUrlList), 5, 'link')
    const batchSize = 500;
  
    //console.log("createEmbeddingsTable data", data)
    
    const tbl = await lance_db.createTable(`website-${_id}`, data.slice(0, Math.min(batchSize, data.length)), embedFunction)
    
    for (var i = batchSize; i < data.length; i += batchSize) {
      await tbl.add(data.slice(i, Math.min(i + batchSize, data.length)))
    }
  
    console.log('Vectors inserted: ', data)
  
    return {name: tbl.name, data}
}
  
// Each article line has a small text column, we include previous lines in order to
// have more context information when creating embeddings
function contextualize(rows: Entry[], contextSize: number, groupColumn: string): EntryWithContext[] {
    const grouped: { [key: string]: any } = []
  
    rows.forEach(row => {
      if (!grouped[row[groupColumn]]) {
        grouped[row[groupColumn]] = []
      }
      
      grouped[row[groupColumn]].push(row)
    })
  
    const data: EntryWithContext[] = []
  
    Object.keys(grouped).forEach(key => {
      for (let i = 0; i < grouped[key].length; i++) {
        const start = i - contextSize > 0 ? i - contextSize : 0
        grouped[key][i].context = grouped[key].slice(start, i + 1).map((r: Entry) => r.text).join(' ')
      }
  
      data.push(...grouped[key])
    })
  
    return data
}

async function getEntriesFromLinks(links: string[]): Promise<Entry[]> {
    let allEntries: Entry[] = [];

    for (const link of links) {
        console.log('Scraping: ', link);

        try {
            const response = await fetch(link, {
            });

            const html = await response.text()

            const $ = load(html);

            const contentArray: string[] = [];

            $('p').each((index: number, element: Element) => {
                contentArray.push($(element).text().trim());
            });
            //console.log("contentArray", contentArray)

            const title = $('title').text().trim()
            //console.log("title", title)

            const content = contentArray
                .join('\n')
                .split('\n')
                .filter(line => line.length > 0)
                .map(line => ({ link: link, title, text: line }));

            //console.log('Content:', content)

            allEntries = allEntries.concat(content);

            console.log('allEntries.length:', allEntries.length)

        } catch (error) {
            console.error(`Error processing ${link}:`, error);
        }
    }

    return allEntries;
}

export async function getWebsiteUrlContent(WebsiteUrlList: string[]): Promise<Entry[]> {
    const allEntries = await getEntriesFromLinks(WebsiteUrlList);

    return allEntries;
}
  