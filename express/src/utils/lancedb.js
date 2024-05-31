import express from 'express';
import crypto from 'crypto';
import { OpenAI } from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { connect } from "vectordb";
import { OpenAIEmbeddingFunction } from 'vectordb';
import { load } from 'cheerio';

import { BytesOutputParser, StringOutputParser } from '@langchain/core/output_parsers';

import { DataDir } from './const.js';
import { db, getDbRecord, getDbRecordALL } from './db.js'

import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''


export async function createEmbeddingsFromList(data, datasetId) {
  const lance_db = await connect(DataDir + '/LanceDb/');

  const embedFunction = new OpenAIEmbeddingFunction('context', OPENAI_API_KEY)

  const allTableExistsList = await lance_db.tableNames()
  //console.log("createEmbeddingsFromList allTableExistsList", allTableExistsList)

  if(allTableExistsList.includes(`${datasetId}`))  {
    await lance_db.dropTable(`${datasetId}`);
    //console.log("createEmbeddingsFromList dropTable ------------", `${datasetId}`)
  }
  if(data.length == 0) {
    return 
  }
  console.log("createEmbeddingsFromList data.length", data.length)
  try {
    const tableData = await lance_db.createTable(`${datasetId}`, data, embedFunction)
    //console.log("createEmbeddingsFromList tableData", tableData)    
    console.log('createEmbeddingsFromList Vectors inserted: ', data.length, Array.isArray(data))  
    return tableData?.name
  }
  catch(error) {
    console.log("lance_db.createTable Failed: ", data.length)
    return 
  }
  
}

export async function createEmbeddingsTable(WebsiteUrlList, datasetId, _id) {
    const lance_db = await connect(DataDir + '/LanceDb/datasetId_' + datasetId + "/" + _id);
  
    const embedFunction = new OpenAIEmbeddingFunction('context', OPENAI_API_KEY)
    const data = contextualize(await getWebsiteUrlContent(WebsiteUrlList), 1, 'link')
    const batchSize = 1;
  
    //console.log("contextualize data", data.slice(0, Math.min(batchSize, data.length)))
    const allTableExistsList = await lance_db.tableNames()
    console.log("tableNamesData", allTableExistsList)

    //const tableData = allTableExistsList.includes(`${_id}`) ? ( await lance_db.openTable(`${_id}`, embedFunction) ) : ( await lance_db.createTable(`${_id}`, [data[0]], embedFunction) )
    //await lance_db.dropTable(`${_id}`);
    const tableData = await lance_db.createTable(`${_id}`, data, embedFunction)
    console.log("tableData", tableData)
    
    for (var i = batchSize; i < data.length; i += batchSize) {
      await tableData.add(data.slice(i, Math.min(i + batchSize, data.length)))
      console.log("batchSize i", i)
    }
  
    console.log('Vectors inserted: ', data.length, Array.isArray(data))
  
    return {name: tableData.name, data}
}
  
// Each article line has a small text column, we include previous lines in order to
// have more context information when creating embeddings
export function contextualize(rows, contextSize, groupColumn) {
    const grouped = []
  
    rows.forEach(row => {
      if (!grouped[row[groupColumn]]) {
        grouped[row[groupColumn]] = []
      }
      
      grouped[row[groupColumn]].push(row)
    })
  
    const data = []
  
    Object.keys(grouped).forEach(key => {
      for (let i = 0; i < grouped[key].length; i++) {
        const start = i - contextSize > 0 ? i - contextSize : 0
        grouped[key][i].context = grouped[key].slice(start, i + 1).map((r) => r.text).join(' ')
      }
  
      data.push(...grouped[key])
    })
  
    return data
}

export async function getWebsiteUrlContent(links) {
    let allEntries = [];

    for (const link of links) {
        console.log('Scraping: ', link);

        try {
            const response = await fetch(link, {
            });

            const html = await response.text()

            const $ = load(html);

            const contentArray = [];

            $('p').each((index, element) => {
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

            //console.log('allEntries:', allEntries)

        } catch (error) {
            console.error(`Error processing ${link}:`, error);
        }
    }

    return allEntries;
}

export async function getWebsiteUrlContext(links) {
  const data = contextualize(await getWebsiteUrlContent(links), 1, 'link')
  return data
}


//检索数据

export const REPHRASE_TEMPLATE_INITIAL = `Rephrase the follow-up question to make it a standalone inquiry, maintaining its original language. You'll be provided with a conversation history and a follow-up question.

Instructions:
1. Review the conversation provided below, including both user and AI messages.
2. Examine the follow-up question included in the conversation.
3. Reconstruct the follow-up question to be self-contained, without requiring context from the previous conversation. Ensure it remains in the same language as the original.

Conversation:
###
{chatHistory}
###

User's Follow-Up Question:
### 
{input}
###

Your Response:`

export const QA_TEMPLATE_INITIAL = `Based on the information provided below from a website, act as a guide to assist someone navigating through the website.

Instructions:
1. Review the conversation history and the contextual information extracted from the website.
2. Assume the role of a helpful agent and respond to the user's input accordingly.
3. Provide guidance, explanations, or assistance as needed, leveraging the website context to enhance your responses.

Conversation History:
###
{chatHistory}
###

Context from Website:
###
{context}
###

User's Input: 
###
{input}
###

Your Response:`


export function formatMessage(message) {
    return `${message.role}: ${message.content}`;
};

export async function rephraseInput(model, chatHistory, input, REPHRASE_TEMPLATE) {
    if (chatHistory.length === 0) return input;

    const rephrasePrompt = PromptTemplate.fromTemplate(REPHRASE_TEMPLATE);

    const stringOutputParser = new StringOutputParser();

    const rephraseChain = rephrasePrompt.pipe(model).pipe(stringOutputParser)

    return rephraseChain.invoke({
        chatHistory: chatHistory.join('\n'),
        input,
    });
}

export async function retrieveContext(query, table, k = 3) {
    const db = await connect(DataDir + '/LanceDb/')
    
    const embedFunction = new OpenAIEmbeddingFunction('context', OPENAI_API_KEY)
    
    const tbl = await db.openTable(table, embedFunction)
    
    //console.log('Query: ', query)
    
    return await tbl
      .search(query)
      .select(['link', 'title', 'text', 'context'])
      .limit(k)
      .execute()
}

export async function ChatDatasetId(res, messages, datasetId, REPHRASE_TEMPLATE, QA_TEMPLATE) {

    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: (0.1),
        openAIApiKey: OPENAI_API_KEY,
        streaming: true,
    });

    const maxDocs = 3

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    
    const currentMessageContent = messages[messages.length - 1].content;

    //console.log("Current message:", currentMessageContent)

    const rephrasedInput = await rephraseInput(model, formattedPreviousMessages, currentMessageContent, REPHRASE_TEMPLATE);

    const context = await (async () => {
        const result = await retrieveContext(rephrasedInput, datasetId, maxDocs)
        //console.log("result:", result, "\n")
        return result.map(c => {
            if (c.title) return `${c.title}\n${c.context}`
            return c.context
        }).join('\n\n---\n\n').substring(0, 3750) // need to make sure our prompt is not larger than max size
    })()
    //console.log("Context:", context)

    const qaPrompt = PromptTemplate.fromTemplate(QA_TEMPLATE);
    const outputParser = new BytesOutputParser();
    const qaChain = qaPrompt.pipe(model).pipe(outputParser);
    //console.log("qaChain:", qaChain, "\n")

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = await qaChain.stream({
        chatHistory: formattedPreviousMessages.join('\n'),
        context, 
        input: rephrasedInput,
    });

    for await (const chunk of stream) {
        res.write(chunk);
    }

}