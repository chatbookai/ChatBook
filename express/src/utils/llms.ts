import { Request, Response } from 'express';

import * as fs from 'fs'
import path from 'path'
import axios from 'axios';
import os from "node:os";
import sharp from 'sharp';

import { OpenAI } from "openai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";

//import { LLMChain } from "langchain/chains";
//import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { GitbookLoader } from "langchain/document_loaders/web/gitbook";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

import https from 'https'; // Used in chatChatDeepSeek

/*
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { JSONLinesLoader } from 'langchain/document_loaders/fs/json';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
*/

import { Document } from '@langchain/core/documents';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { DataDir } from './const';
import { db, getDbRecord, getDbRecordALL } from './db'
import { getLLMSSetting, log, isFile, formatDateString, enableDir, getNanoid, writeFile } from './utils'

import { LanceDB } from "@langchain/community/vectorstores/lancedb";
import { connect } from "vectordb";

import { createEmbeddingsFromList, getWebsiteUrlContext, Entry, EntryWithContext } from './lancedb';


//.ENV
import dotenv from 'dotenv';

dotenv.config();

type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const PINECONE_NAME_SPACE = process.env.PINECONE_NAME_SPACE;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


let getLLMSSettingData: any = null
let ChatOpenAIModel: any = null
let pinecone: any = null
let ChatBookOpenAIStreamResponse = ''
let ChatGeminiModel: any = null
let ChatBaiduWenxinModel: any = null

  export function NotUsed() {
    console.log("OpenAI", OpenAI)
    console.log("PromptTemplate", PromptTemplate)
  }

  export async function initChatBookOpenAI(datasetId: number | string) {
    getLLMSSettingData = await getLLMSSetting(datasetId);
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
    const OPENAI_Temperature = getLLMSSettingData.Temperature;
    if(OPENAI_API_KEY && PINECONE_API_KEY) {
      if(OPENAI_API_BASE && OPENAI_API_BASE !='' && OPENAI_API_BASE.length > 16) {
        process.env.OPENAI_BASE_URL = OPENAI_API_BASE
        process.env.OPENAI_API_KEY = OPENAI_API_KEY
      }
      ChatOpenAIModel = new ChatOpenAI({ 
        modelName: getLLMSSettingData.ModelName ?? "gpt-3.5-turbo",
        openAIApiKey: OPENAI_API_KEY, 
        temperature: Number(OPENAI_Temperature)
       });
      pinecone = new Pinecone({apiKey: PINECONE_API_KEY});
    }
  }

  export async function initChatBookOpenAIStream(res: Response, datasetId: number | string) {
    
  }

  export async function ChatApp(_id: string, res: Response, userId: string, question: string, history: any[], template: string, appId: string, publishId: string, allowChatLog: number, temperature: number) {

    const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT * from app where _id = ?", [appId]);
    const AppDataText: string = Records ? Records.data : null;  
    const app: any = JSON.parse(AppDataText)
    if(app && app.modules) {
      const AiNode = app.modules.filter((item: any)=>item.type == 'chatNode')
      if(AiNode && AiNode[0] && AiNode[0].data && AiNode[0].data.inputs) {
        const modelList = AiNode[0].data.inputs.filter((itemNode: any)=>itemNode.key == 'model')
        if(modelList && modelList[0] && modelList[0]['value']) {
          const modelName = modelList[0]['value']
          switch(modelName) {
            case 'gpt-3.5-turbo':
              await chatChatOpenAI(_id, res, userId, question, history, template, appId, publishId || '', allowChatLog, temperature);
              break;
            case 'gemini-pro':
              await chatChatDeepSeek(_id, res, userId, question, history, template, appId, publishId || '', allowChatLog, temperature);
              break;
            case 'DeepSeek':
              await chatChatDeepSeek(_id, res, userId, question, history, template, appId, publishId || '', allowChatLog, temperature);
              break;
          }
        }
        else {
          console.log("Can not found ai modelName...")
        }
      }
      else {
        console.log("Can not found ai chatNode...")
      }
    }
    else {
      console.log("Can not found ai app data...")
    }

  }

  export async function chatChatOpenAI(_id: string, res: Response, userId: string, question: string, history: any[], template: string, appId: string, publishId: string, allowChatLog: number, temperature: number) {
    ChatBookOpenAIStreamResponse = ''
    const startTime = performance.now()
    if(OPENAI_API_KEY && PINECONE_API_KEY) {
      try{
        ChatOpenAIModel = new ChatOpenAI({ 
          modelName: "gpt-3.5-turbo",
          openAIApiKey: OPENAI_API_KEY, 
          temperature: Number(temperature || 0.5),
          streaming: true,
          callbacks: [
            {
              handleLLMNewToken(token) {
                res.write(token);
                ChatBookOpenAIStreamResponse = ChatBookOpenAIStreamResponse + token
              },
            },
          ],
         });    
        pinecone = new Pinecone({apiKey: PINECONE_API_KEY,});
      }
      catch(Error: any) {
        log('initChatBookOpenAIStream', 'initChatBookOpenAIStream', 'initChatBookOpenAIStream', "initChatBookOpenAIStream Error", Error)
        return 
      }
    }
    else {
      res.write("Not set API_KEY in initChatBookOpenAIStream");
      res.end();
      return 
    }
    const pastMessages: any[] = []
    if(template && template!='') {
      pastMessages.push(new SystemMessage(template))
    }
    if(history && history.length > 0) {
      history.map((Item) => {
        if(Item[0]) {
          pastMessages.push(new HumanMessage(Item[0]))
        }
        if(Item[1]) {
          pastMessages.push(new AIMessage(Item[1]))
        }
      })
    }
    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(pastMessages),
    });
    try {
      const chain = new ConversationChain({ llm: ChatOpenAIModel, memory: memory });
      await chain.call({ input: question});
      const endTime = performance.now()
      const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100   
      if(allowChatLog == 1)   {
        const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (_id, send, Received, userId, timestamp, source, history, responseTime, appId, publishId) VALUES (?,?,?,?,?,?,?,?,?,?)');
        insertChatLog.run(_id, question, ChatBookOpenAIStreamResponse, userId, Date.now(), JSON.stringify([]), JSON.stringify(history), responseTime, appId, publishId);
        insertChatLog.finalize();
        console.log("chatChatOpenAI: ", temperature, question, " => ", ChatBookOpenAIStreamResponse)
      }
    }
    catch(error: any) {
      console.log("chatChatOpenAI error", error.message)
      res.write(error.message)
    }    
    res.end();
  }

  export async function chatChatDeepSeek(_id: string, res: Response, userId: string, question: string, history: any[], template: string, appId: string, publishId: string, allowChatLog: number, temperature: number) {
    const startTime = performance.now()
    const pastMessages: any[] = [];
    if (template && template !== '') {
        pastMessages.push({ "role": "system", "content": template });
    }
    if (history && history.length > 0) {
        history.forEach((Item) => {
            if (Item[0]) {
                pastMessages.push({ "role": "user", "content": Item[0] });
            }
            if (Item[1]) {
                pastMessages.push({ "role": "assistant", "content": Item[1] });
            }
        });
    }
    pastMessages.push({ "role": "user", "content": question });

    let options = {
      'method': 'POST',
      'hostname': 'api.deepseek.com',
      'path': '/chat/completions',
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + process.env.DEEPSEEK_API_KEY
      },
      'maxRedirects': 20
    };
    try {
      const reqFromAi = https.request(options, (resFromAi) => {
        let chunks: any[] = [];
        resFromAi.setEncoding('utf8');
        resFromAi.on("data", (chunk) => {
          if( chunk && chunk != 'data: [DONE]' && chunk != 'data: [DONE]\n' && !chunk.startsWith('data: [DONE]') )  {
            const cleanedChunk = chunk.replace(/^data: /, '');
            try {
              console.log('cleanedChunk cleanedChunk:', cleanedChunk);
              const chunkData = JSON.parse(cleanedChunk);
              if (chunkData && chunkData.choices && Array.isArray(chunkData.choices)) {
                chunkData.choices.forEach((choice: any) => {
                    const ReplayContent = choice?.delta?.content
                    if(ReplayContent != null) {
                      //console.log('Received choice:', ReplayContent);
                      chunks.push(ReplayContent);
                      res.write(ReplayContent)
                    }
                });
              }
            }
            catch (error) {
              console.error('chatChatDeepSeek Error parsing JSON:', error);
            }
          }
        });
        resFromAi.on("end", () => {
          console.log("body.toString()", chunks.join(''));
          const StreamResponse = chunks.join('')
          const endTime = performance.now()
          const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100   
          if(allowChatLog == 1)   {
            const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (_id, send, Received, userId, timestamp, source, history, responseTime, appId, publishId) VALUES (?,?,?,?,?,?,?,?,?,?)');
            insertChatLog.run(_id, question, StreamResponse, userId, Date.now(), JSON.stringify([]), JSON.stringify(history), responseTime, appId, publishId);
            insertChatLog.finalize();
          }
          console.log("chatChatDeepSeek: ", temperature, question, " => ", StreamResponse)
          res.end();
        });
        resFromAi.on("error", (error) => {
          console.error("chatChatDeepSeek Error", error);
          res.end();
        });
      });    
      let postData = JSON.stringify({
        "messages": pastMessages,
        "model": "deepseek-chat",
        "frequency_penalty": 0,
        "max_tokens": 2048,
        "presence_penalty": 0,
        "stop": null,
        "stream": true,
        "temperature": Number(temperature || 0.5),
        "top_p": 1,
        "logprobs": false,
        "top_logprobs": null
      });
      reqFromAi.write(postData);    
      reqFromAi.end();

    }
    catch(error: any) {
      console.log("chatChatDeepSeek error", error.message)
      res.write(error.message)
    }
  }

  export async function chatKnowledgeOpenAI(res: Response, userId: number, question: string, history: any[], appId: number) {
    const datasetId = ''
    await initChatBookOpenAIStream(res, datasetId)
    if(!ChatOpenAIModel) {
      res.end();
      return
    }
    const CONDENSE_TEMPLATE: string | unknown = '';
    const QA_TEMPLATE: string | unknown = '';

    if (!question) {
      return { message: 'No question in the request' };
    }
  
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
    /*
    try {
      
      const index = pinecone.Index(PINECONE_INDEX_NAME);
  

      const PINECONE_NAME_SPACE_USE = PINECONE_NAME_SPACE + '_' + String(datasetId)

      const embeddings = new OpenAIEmbeddings({openAIApiKey:getLLMSSettingData.OPENAI_API_KEY});
      
      const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        {
          pineconeIndex: index,
          textKey: 'text',
          namespace: PINECONE_NAME_SPACE_USE,
        },
      );
      
      // Use a callback to get intermediate sources from the middle of the chain
      let resolveWithDocuments: any;
      const documentPromise = new Promise((resolve) => {
        resolveWithDocuments = resolve;
      });

      const retriever = vectorStore.asRetriever({
        callbacks: [
          {
            handleRetrieverEnd(documents) {
              resolveWithDocuments(documents);
            },
          },
        ],
      });

      const chain = makeChainOpenAI(retriever, String(CONDENSE_TEMPLATE), String(QA_TEMPLATE) );

      const pastMessages = history.map((message) => {
                                    return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
                                  }).join('\n');
  
      // Ask a question using chat history
      const response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: pastMessages,
      });
  
      const sourceDocuments = await documentPromise;

      const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (send, Received, userId, timestamp, source, history, appId) VALUES (?,?,?,?,?,?,?)');
      insertChatLog.run(question, response, userId, Date.now(), JSON.stringify(sourceDocuments), JSON.stringify(history), appId);
      insertChatLog.finalize();
      res.end();

      return { text: response, sourceDocuments };
    } 
    catch (error: any) {

      return { error: error.message || 'Something went wrong' };
    }
    */
  }

  export function makeChainOpenAI(retriever: any, CONDENSE_TEMPLATE: string, QA_TEMPLATE: string) {
    const condenseQuestionPrompt = ChatPromptTemplate.fromTemplate(CONDENSE_TEMPLATE);
    const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

    // Rephrase the initial question into a dereferenced standalone question based on
    // the chat history to allow effective vectorstore querying.
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      ChatOpenAIModel,
      new StringOutputParser(),
    ]);

    // Retrieve documents based on a query, then format them.
    const retrievalChain = retriever.pipe(combineDocumentsFn);

    // Generate an answer to the standalone question based on the chat history
    // and retrieved documents. Additionally, we return the source documents directly.
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      ChatOpenAIModel,
      new StringOutputParser(),
    ]);

    // First generate a standalone question, then answer it based on
    // chat history and retrieved context documents.
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
    ]);

    return conversationalRetrievalQAChain;
  }

  export function combineDocumentsFn(docs: any[], separator = '\n\n') {
    const serializedDocs = docs.map((doc) => doc.pageContent);

    return serializedDocs.join(separator);
  }

  export async function initChatBookGeminiStream(res: Response, datasetId: number | string) {
    getLLMSSettingData = await getLLMSSetting(datasetId);
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
    if(OPENAI_API_KEY && PINECONE_API_KEY) {
      process.env.GOOGLE_API_KEY = OPENAI_API_KEY
      ChatGeminiModel = new ChatGoogleGenerativeAI({
          modelName: getLLMSSettingData.ModelName ?? "gemini-pro",
          maxOutputTokens: 2048,
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
          ],
      });
      pinecone = new Pinecone({apiKey: PINECONE_API_KEY,});
    }
    else {
      res.write("Not set API_KEY");
      res.end();
    }
  }

  export async function chatChatGemini(_id: string, res: Response, userId: string, question: string, history: any[], template: string, appId: string, publishId: string, allowChatLog: number) {
    const datasetId = ''
    await initChatBookGeminiStream(res, datasetId)
    const pastMessages: any[] = []
    if(template && template!='') {
      pastMessages.push(new SystemMessage(template))
    }
    if(history && history.length > 0) {
      history.map((Item) => {
        if(Item[0]) {
          pastMessages.push(new HumanMessage(Item[0]))
        }
        if(Item[1]) {
          pastMessages.push(new AIMessage(Item[1]))
        }
      })
    }
    pastMessages.push(new HumanMessage(question))

    try {
      const startTime = performance.now()
      const res3 = await ChatGeminiModel.stream(pastMessages);
      let response = '';
      for await (const chunk of res3) {
          console.log(chunk.content);
          res.write(chunk.content);
          response = response + chunk.content
      }
      const endTime = performance.now()
      const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100   
      if(allowChatLog == 1)   {
        const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (_id, send, Received, userId, timestamp, source, history, responseTime, appId, publishId) VALUES (?,?,?,?,?,?,?,?,?,?)');
        insertChatLog.run(_id, question, response, userId, Date.now(), JSON.stringify([]), JSON.stringify(history), responseTime, appId, publishId);
        insertChatLog.finalize();
      }
    }
    catch(error: any) {
      console.log("chatChatGemini error", error.message)
      res.write(error.message)
    }
    res.end();
  }

  export async function chatChatGeminiMindMap(res: Response, userId: string, question: string, history: any[], template: string, appId: number) {
    const datasetId = ''
    await initChatBookGeminiStream(res, datasetId)
    const TextPrompts = template && template != '' ? template : "\n 要求生成一份PPT的大纲,以行业总结性报告的形式显现,生成15-20页左右,每一页3-6个要点,每一个要点字数在10-30之间,返回格式为Markdown,标题格式使用: **标题名称** 的形式表达."
    const input2 = [
        new HumanMessage({
          content: [
            {
              type: "text",
              text: question + TextPrompts,
            },
          ],
        }),
      ];
    try {
      const res3 = await ChatGeminiModel.stream(input2);
      let response = '';
      for await (const chunk of res3) {
          //console.log(chunk.content);
          res.write(chunk.content);
          response = response + chunk.content
      }
      const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (send, Received, userId, timestamp, source, history, appId) VALUES (?,?,?,?,?,?,?)');
      insertChatLog.run(question, response, userId, Date.now(), JSON.stringify([]), JSON.stringify(history), appId);
      insertChatLog.finalize();
    }
    catch(error: any) {
      console.log("chatChatGemini error", error.message)
      res.write(error.message)
    }
    res.end();
  }

  export async function initChatBookBaiduWenxinStream(res: Response, datasetId: number | string) {
    getLLMSSettingData = await getLLMSSetting(datasetId);
    const BAIDU_API_KEY = getLLMSSettingData.OPENAI_API_KEY ?? "1AWXpm1Cd8lbxmAaFoPR0dNx";
    const BAIDU_SECRET_KEY = getLLMSSettingData.OPENAI_API_BASE ?? "TQy5sT9Mz4xKn0tR8h7W6LxPWIUNnXqq";
    const OPENAI_Temperature = 1;
    if(BAIDU_API_KEY && PINECONE_API_KEY) {
      process.env.BAIDU_API_KEY = BAIDU_API_KEY
      process.env.BAIDU_SECRET_KEY = BAIDU_SECRET_KEY
      try {
        ChatBaiduWenxinModel = new ChatBaiduWenxin({
          modelName: getLLMSSettingData.ModelName ?? "ERNIE-Bot-4", // Available models: ERNIE-Bot, ERNIE-Bot-turbo, ERNIE-Bot-4
          temperature: OPENAI_Temperature,
          baiduApiKey: process.env.BAIDU_API_KEY, // In Node.js defaults to process.env.BAIDU_API_KEY
          baiduSecretKey: process.env.BAIDU_SECRET_KEY, // In Node.js defaults to process.env.BAIDU_SECRET_KEY
        });
      }
      catch(error) {
        console.log("initChatBookBaiduWenxinStream ChatBaiduWenxinModel:", error)
      }
      pinecone = new Pinecone({apiKey: PINECONE_API_KEY,});
    }
    else {
      res.write("Not set API_KEY");
      res.end();
    }
  }

  export async function chatChatBaiduWenxin(res: Response, userId: string, question: string, history: any[], template: string, appId: number) {
    const datasetId = ''
    await initChatBookBaiduWenxinStream(res, datasetId);
    if(!ChatBaiduWenxinModel) {
      res.end();
      return
    }
    try {
      const pastMessages: any[] = []
      if(template && template!='') {
        pastMessages.push(new SystemMessage(template))
      }
      if(history && history.length > 0) {
        history.map((Item) => {
          if(Item[0]) {
            pastMessages.push(new HumanMessage(Item[0]))
          }
          if(Item[1]) {
            pastMessages.push(new AIMessage(Item[1]))
          }
        })
      }
      pastMessages.push(new HumanMessage(question))
      const response = await ChatBaiduWenxinModel.call(pastMessages);
      console.log("response", response.content);
      const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (send, Received, userId, timestamp, source, history, appId) VALUES (?,?,?,?,?,?,?)');
      insertChatLog.run(question, response.content, userId, Date.now(), JSON.stringify([]), JSON.stringify(history), appId);
      insertChatLog.finalize();

      return response.content;
    }
    catch(error: any) {
      console.log("chatChatOpenAI error", error.message)
      return error.message;
    }    
  }

  export async function debug_agent(res: Response, datasetId: number | string) {
    

  }

  export async function GenereateImageUsingDallE2(res: Response, userId: string, question: string, size='1024x1024') {
    const datasetId = ''
    getLLMSSettingData = await getLLMSSetting(datasetId);    
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE ?? "https://api.openai.com/v1";
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;    
    if(OPENAI_API_KEY && PINECONE_API_KEY) {
      const requestData = {
        model: 'dall-e-2',
        prompt: question,
        n: 1,
        size: size,
        style: 'vivid'
      };
      
      //style: natural | vivid
      //256x256, 512x512, or 1024x1024 for dall-e-2
      try {
        const response = await axios.post(OPENAI_API_BASE + '/images/generations', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        });
        const generatedImage = response.data;

        if(generatedImage && generatedImage['data'] && generatedImage['data'][0] && generatedImage['data'][0]['url']) {
          const response = await axios({
            method: 'get',
            url: generatedImage['data'][0]['url'],
            responseType: 'arraybuffer',  // 使用 arraybuffer
          });
          const data = Buffer.from(response.data);
          const DateNow = Date.now();
          const ShortFileName = DateNow + '-' + Math.round(Math.random() * 1e9) + '-' + datasetId;
          const FileName = DataDir + "/image/"+ ShortFileName + ".png";
          const generatedImageTS = {...requestData, FileName: FileName, type: 'image', status: 'OK', timestamp: DateNow, ShortFileName: ShortFileName}
          fs.writeFileSync(FileName, data);
          console.log("response", response)

          const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?)');
          insertChatLog.run(question, JSON.stringify(generatedImageTS), userId, Date.now(), JSON.stringify([]), JSON.stringify([]));
          insertChatLog.finalize();
          
          await compressPng(ShortFileName);

          return generatedImageTS;
        }
        else {
          console.log('Error generating image:', generatedImage);

          return {generatedImage};
        }
    
        
      } 
      catch (error) {
        console.log('Error generating image:', error);

        return {error};
      }
    }
    else {
      res.write("Not set API_KEY");
      res.end();
    }
  }

  export async function GenereateAudioUsingTTS(res: Response, ModelId: string, userId: string, question: string, voice='alloy', appId: string) {
    getLLMSSettingData = await getLLMSSetting(ModelId);    
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE ?? "https://api.openai.com/v1";
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
    
    if(OPENAI_API_KEY && OPENAI_API_KEY != '') {
      const requestData = {
        model: 'tts-1',
        voice: voice,
        input: question,
        response_format: "mp3",
      };
      try {
        const startTime = performance.now()
        const response = await axios.post(OPENAI_API_BASE + '/audio/speech', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          responseType: 'arraybuffer'
        });  
        console.log('Generated Audio:', response.data);
        const generatedAudio = response.data;
        const data = Buffer.from(generatedAudio);
        const DateNow = Date.now();
        const formatDateStringValue = formatDateString(DateNow)
        const ShortFileName = formatDateStringValue + "_" + appId + '-' + Math.round(Math.random() * 1e9) + '-' + ModelId;
        const FileName = DataDir + "/audio/" + formatDateStringValue + "/" + ShortFileName + ".mp3";
        enableDir(DataDir + "/audio/" + formatDateStringValue + "/");
        fs.writeFileSync(FileName, data);
        const generatedAudioTS = {...requestData, FileName: FileName, type: 'audio', status: 'OK', timestamp: DateNow, ShortFileName: ShortFileName}
        const endTime = performance.now()
        const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100   
        //const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (send, Received, userId, timestamp, source, history, responseTime, appId) VALUES (?,?,?,?,?,?,?,?)');
        //insertChatLog.run(question, JSON.stringify(generatedAudioTS), userId, DateNow, JSON.stringify([]), JSON.stringify([]), responseTime, appId);
        //insertChatLog.finalize();
        console.log('Generated Audio:', generatedAudioTS);

        return generatedAudioTS;
      } 
      catch (error) {
        console.log('Error generating Audio:', error);

        return {error};
      }
    }
    else {
      res.write("Not set API_KEY");
      res.end();
    }
  }

  export async function outputAudio(res: Response, file: string) {
    try {
      const fileList = file.split('_')
      const FileName = DataDir + "/audio/" + fileList[0] + "/" + file + ".mp3";
      if(isFile(FileName))   {
        const readStream = fs.createReadStream(FileName);
        res.setHeader('Content-Type', 'audio/mpeg');
        readStream.pipe(res);
        console.log("FileName Exist: ", FileName)
      }
      else {
        res.status(200).json({ error: 'File not exist', FileName })
      }
    } 
    catch (error) {
        console.error('outputImage Error:', error);
        res.status(200).json({ error: 'File not exist and can not open' })
    }
  }

  export async function compressPng(file: string) {
    const FileName = path.join(DataDir, "/image/"+ file + ".png");
    const FileNameNew = path.join(DataDir, "/image/"+ file + "_thumbnail.png");
    if(!isFile(FileNameNew) && isFile(FileName))   {
      const quality = 80;
      try { 
        await sharp(FileName).resize({ fit: 'inside', width: 800, withoutEnlargement: true }).png({ quality }).toFile(FileNameNew);
      }
      catch(error: any) {
        console.log("compressPng", file, error.message)
      }

    }
  }

  export async function compressImageForImage(file: string, width: number | undefined, height: number | undefined) {
    const FileName = path.join(DataDir, "/imageforimage/"+ file);
    const FileNameNew = path.join(DataDir, "/imageforimage/Resize_" + (width ? width+'_'+file : height+'_'+file) );
    if(!isFile(FileNameNew) && isFile(FileName))   {
      const quality = 80;
      try { 
        if(width) {
          await sharp(FileName).resize({ fit: 'inside', width: width, withoutEnlargement: true }).png({ quality }).toFile(FileNameNew);
        }
        else if(height) {
          await sharp(FileName).resize({ fit: 'inside', height: height, withoutEnlargement: true }).png({ quality }).toFile(FileNameNew);
        }
      }
      catch(error: any) {
        console.log("compressPng", file, error.message)
      }
      console.log("compressPng", file)
    }
    return FileNameNew
  }

  export async function outputImage(res: Response, file: string) {
    try {
      await compressPng(file);
      const FileName = path.join(DataDir, "/image/"+ file + "_thumbnail.png");
      if(isFile(FileName))   {
        compressPng(file);
        const readStream = fs.createReadStream(FileName);
        res.setHeader('Content-Type', 'image/png');
        readStream.pipe(res);
        console.log("FileName Exist: ", FileName)
      }
      else {
        res.status(200).json({ error: 'File not exist' })
      }
    } 
    catch (error) {
        console.error('outputImage Error:', error);
        res.status(200).json({ error: 'File not exist' })
    }
  }

  export async function outputAvatarForApp(res: Response, file: string) {
    try {
      await compressPng(file);
      const FileName = path.join(DataDir, "/avatarforapp/"+ file);
      if(isFile(FileName))   {
        compressPng(file);
        const readStream = fs.createReadStream(FileName);
        res.setHeader('Content-Type', 'image/png');
        readStream.pipe(res);
        console.log("FileName Exist: ", FileName)
      }
      else {
        res.status(200).json({ error: 'File not exist' })
      }
    } 
    catch (error) {
        console.error('outputImage Error:', error);
        res.status(200).json({ error: 'File not exist' })
    }
  }

  export async function outputAvatarForDataset(res: Response, file: string) {
    try {
      await compressPng(file);
      const FileName = path.join(DataDir, "/avatarfordataset/"+ file);
      if(isFile(FileName))   {
        compressPng(file);
        const readStream = fs.createReadStream(FileName);
        res.setHeader('Content-Type', 'image/png');
        readStream.pipe(res);
        console.log("FileName Exist: ", FileName)
      }
      else {
        res.status(200).json({ error: 'File not exist' })
      }
    } 
    catch (error) {
        console.error('outputImage Error:', error);
        res.status(200).json({ error: 'File not exist' })
    }
  }

  export async function outputImageOrigin(res: Response, file: string) {
    try {
      const FileName = path.join(DataDir, "/image/"+ file + ".png");
      if(isFile(FileName))   {
        const readStream = fs.createReadStream(FileName);
        res.setHeader('Content-Type', 'image/png');
        readStream.pipe(res);
        console.log("FileName Exist: ", FileName)
      }
      else {
        res.status(200).json({ error: 'File not exist' })
      }
    } 
    catch (error) {
        console.error('outputImage Error:', error);
        res.status(200).json({ error: 'File not exist' })
    }
  }

  //此处只做数据转文本操作, 向量化数据在另外一个函数里面.
  export async function parseFilesAndWeb() {
    try {

      const RecordsAll: any[] = await getDbRecordALL(`SELECT * from collection where status = '0' order by id asc limit 10`) as any[];
      await Promise.all(RecordsAll.map(async (CollectionItem: any)=>{
        
        if(CollectionItem && CollectionItem.type == 'Web' && CollectionItem.name && CollectionItem.name.trim().startsWith('http'))  {
          const getWebsiteUrlContextData = await getWebsiteUrlContext([CollectionItem.name.trim()]);
          //console.log('getWebsiteUrlContextData docs', getWebsiteUrlContextData);
          const UpdateFileParseStatus = db.prepare('update collection set status = ?, content = ? where id = ?');
          UpdateFileParseStatus.run(1, JSON.stringify(getWebsiteUrlContextData) ,CollectionItem.id);
          UpdateFileParseStatus.finalize();
        }
        else if(CollectionItem && CollectionItem.type == 'File') {
          const filePath = DataDir + '/uploadfiles/' + CollectionItem.newName;
          let LoaderData: any = null
          if(CollectionItem.suffixName == '.pdf' && isFile(filePath))  {
            LoaderData = new PDFLoader(filePath);
          }
          if(CollectionItem.suffixName == '.csv' && isFile(filePath))  {
            LoaderData = new CSVLoader(filePath);
          }
          if(CollectionItem.suffixName == '.txt' && isFile(filePath))  {
            LoaderData = new TextLoader(filePath);
          }
          if(LoaderData)  {
            const rawDoc = await LoaderData.load();
            const textSplitter = new RecursiveCharacterTextSplitter({
              chunkSize: 1000,
              chunkOverlap: 200,
            });
            const SplitterDocs = await textSplitter.splitDocuments(rawDoc);
            //console.log("PDFLoader SplitterDocs", SplitterDocs)
            const filePathJson = DataDir + '/parsedfiles/' + CollectionItem.newName + '.json';
            fs.writeFileSync(filePathJson, JSON.stringify(SplitterDocs));
            const UpdateFileParseStatus = db.prepare('update collection set status = ?, content = ? where id = ?');
            UpdateFileParseStatus.run(1, filePathJson, CollectionItem.id);
            UpdateFileParseStatus.finalize();
            const UpdateDatasetStatus = db.prepare('update dataset set syncStatus = ? where _id = ?');
            UpdateDatasetStatus.run(1, CollectionItem.datasetId);
            UpdateDatasetStatus.finalize();
            const destinationFilePath = path.join(DataDir + '/parsedfiles/', CollectionItem.newName);
            console.log("destinationFilePath", destinationFilePath)
            fs.rename(DataDir + '/uploadfiles/' + CollectionItem.newName, destinationFilePath, (err: any) => {
              if (err) {
                console.log('parseFilesAndWeb Error moving file:', err, CollectionItem.newName);
              } else {
                console.log('parseFilesAndWeb File moved successfully.', CollectionItem.newName);
              }
            });
          }
          else {
            console.log('Not support file type: ', CollectionItem.suffixName);
          }
        }
        else {
          console.log('Not a File & Web: ', CollectionItem.name);
        }

      }))

    } catch (error: any) {
      console.log('parseFilesAndWeb Failed to ingest your data', error);
    }
  }

  export async function vectorDdProcess() {
    try {
      const RecordsAll: any[] = await getDbRecordALL(`SELECT * from dataset where syncStatus = '1' limit 1`) as any[];
      await Promise.all(RecordsAll.map(async (DatasetItem: any)=>{
        
        const Records: any = await (getDbRecord as SqliteQueryFunction)("SELECT COUNT(*) AS NUM from collection where datasetId = ? and status = ? ", [DatasetItem._id, 0]);
        
        console.log("Records", Records)
        if(Records && Records.NUM > 0)    {
          const UpdateFileParseStatus = db.prepare('update dataset set syncStatus = ? where id = ?');
          UpdateFileParseStatus.run(0, DatasetItem.id);
          UpdateFileParseStatus.finalize();
        }
        else {
          //开始处理向量化,每一个表只能新建立一次
          if(OPENAI_API_KEY) {
            try{
              ChatOpenAIModel = new ChatOpenAI({ 
                modelName: "gpt-3.5-turbo",
                openAIApiKey: OPENAI_API_KEY, 
                temperature: Number(0.1),
               });
            }
            catch(Error: any) {
              log('parseFilesAndWeb', 'parseFilesAndWeb', 'parseFilesAndWeb', "parseFilesAndWeb Error", Error)
            }
          }
          if(ChatOpenAIModel)   {
            const collectionList: any[] = await (getDbRecordALL as SqliteQueryFunction)(`SELECT * from collection where datasetId = ?`, [DatasetItem._id]) as any[];
            //console.log("collectionList", collectionList)
            const LanceDbData: EntryWithContext[] = [];
            collectionList.map((CollectionItem: any, CollectionIndex: number)=>{
              if(CollectionItem.type == 'File' && isFile(CollectionItem.content)) {
                const FileContent = fs.readFileSync(CollectionItem.content, 'utf8');
                const Content = JSON.parse(FileContent)
                Content.map((ContentItem: any, ContentIndex: number)=>{
                  //console.log("ContentItem", ContentItem.metadata.loc)
                  //console.log("ContentItem", ContentItem.metadata.pdf)
                  //console.log("ContentItem", ContentItem.metadata.source)
                  LanceDbData.push({
                    link: ContentItem.metadata.source,
                    title: ContentItem.metadata.source,
                    text: ContentItem.pageContent,
                    context: ContentItem.pageContent,
                  } as EntryWithContext)
                })
              }
            })
            const createEmbeddingsFromListData = await createEmbeddingsFromList(LanceDbData, DatasetItem._id)
            if(createEmbeddingsFromListData)  {
              const UpdateFileParseStatus = db.prepare('update dataset set syncStatus = ? where id = ?');
              UpdateFileParseStatus.run(2, DatasetItem.id);
              UpdateFileParseStatus.finalize();
              console.log("完成数据向量化操作:", createEmbeddingsFromListData)
            }
          }
  
              
        }
        
      }))

    } catch (error: any) {
      console.log('vectorDdProcess Failed to ingest your data', error);
    }
  }




