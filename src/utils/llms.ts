// @ts-ignore
import { NextApiResponse } from 'next';

import * as fs from 'fs'
import path from 'path'


import { OpenAI, ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";

//import { LLMChain } from "langchain/chains";
//import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";


import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from '@langchain/community/vectorstores/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { JSONLinesLoader } from 'langchain/document_loaders/fs/json';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';

//import { Document } from '@langchain/core/documents';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { setting } from './utils'
import { getLLMSSetting, GetSetting, log, getKnowledgePage, enableDir } from './utils'

//.ENV
import dotenv from 'dotenv';

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const PINECONE_NAME_SPACE = process.env.PINECONE_NAME_SPACE;

const [DataDir, db, userId] = setting()

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

  export async function initChatBookOpenAI(knowledgeId: number | string) {
    getLLMSSettingData = await getLLMSSetting(knowledgeId);
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
    const OPENAI_Temperature = getLLMSSettingData.Temperature;
    if(OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
      if(OPENAI_API_BASE && OPENAI_API_BASE !='' && OPENAI_API_BASE.length > 16) {
        process.env.OPENAI_BASE_URL = OPENAI_API_BASE
        process.env.OPENAI_API_KEY = OPENAI_API_KEY
      }
      ChatOpenAIModel = new ChatOpenAI({ 
        openAIApiKey: OPENAI_API_KEY, 
        temperature: Number(OPENAI_Temperature)
       });    
      pinecone = new Pinecone({apiKey: PINECONE_API_KEY,});
    }
  }

  export async function initChatBookOpenAIStream(res: NextApiResponse, knowledgeId: number | string) {
    getLLMSSettingData = await getLLMSSetting(knowledgeId);
    console.log("OpenAI getLLMSSettingData", getLLMSSettingData)
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
    const OPENAI_Temperature = getLLMSSettingData.Temperature;
    if(OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
      if(OPENAI_API_BASE && OPENAI_API_BASE !='' && OPENAI_API_BASE.length > 16) {
        process.env.OPENAI_BASE_URL = OPENAI_API_BASE
        process.env.OPENAI_API_KEY = OPENAI_API_KEY
      }
      ChatOpenAIModel = new ChatOpenAI({ 
        openAIApiKey: OPENAI_API_KEY, 
        temperature: Number(OPENAI_Temperature),
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
  }

  export async function chatChatOpenAI(res: NextApiResponse, knowledgeId: number | string, question: string, history: any[]) {
    ChatBookOpenAIStreamResponse = ''
    await initChatBookOpenAIStream(res, knowledgeId)
    const pastMessages: any[] = []
    if(history && history.length > 0) {
      history.map((Item) => {
        pastMessages.push(new HumanMessage(Item[0]))
        pastMessages.push(new AIMessage(Item[1]))
      })
    }
    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(pastMessages),
    });
    const chain = new ConversationChain({ llm: ChatOpenAIModel, memory: memory });
    await chain.call({ input: question});
    
    const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)');
    insertChatLog.run(knowledgeId, question, ChatBookOpenAIStreamResponse, userId, Date.now(), JSON.stringify([]), JSON.stringify(history));
    insertChatLog.finalize();
    res.end();
  }

  export async function chatKnowledgeOpenAI(res: NextApiResponse, knowledgeId: number | string, question: string, history: any[]) {
    await initChatBookOpenAIStream(res, knowledgeId)
    const CONDENSE_TEMPLATE: string | unknown = await GetSetting("CONDENSE_TEMPLATE", knowledgeId, userId);
    const QA_TEMPLATE: string | unknown = await GetSetting("QA_TEMPLATE", knowledgeId, userId);

    log("Chat pinecone", pinecone)
    log("Chat knowledgeId", knowledgeId)
    log("Chat CONDENSE_TEMPLATE", CONDENSE_TEMPLATE)
    log("Chat QA_TEMPLATE", QA_TEMPLATE)
    log("Chat PINECONE_INDEX_NAME", PINECONE_INDEX_NAME)
    
    if (!question) {
      return { message: 'No question in the request' };
    }
  
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
  
    try {
      
      const index = pinecone.Index(PINECONE_INDEX_NAME);
  
      /* create vectorstore */

      const PINECONE_NAME_SPACE_USE = PINECONE_NAME_SPACE + '_' + String(knowledgeId)
      log("Chat PINECONE_NAME_SPACE_USE", PINECONE_NAME_SPACE_USE)

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

      const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)');
      insertChatLog.run(Number(knowledgeId), question, response, userId, Date.now(), JSON.stringify(sourceDocuments), JSON.stringify(history));
      insertChatLog.finalize();
      res.end();

      return { text: response, sourceDocuments };
    } 
    catch (error: any) {
      log('Error Chat:', error);

      return { error: error.message || 'Something went wrong' };
    }
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
  
  export async function debug(res: NextApiResponse, knowledgeId: number | string) {
    await initChatBookOpenAIStream(res, knowledgeId)

    const pastMessages = [
      new HumanMessage("what is Bitcoin?"),
      new AIMessage("Nice to meet you, Jonas!"),
    ];
    
    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new ConversationChain({ llm: ChatOpenAIModel, memory: memory });

    const res2 = await chain.call({ input: "What's the price?" });
    console.log({ res2 });
    
  }

  export async function parseFiles() {
    try {
      const getKnowledgePageRS = await getKnowledgePage(0, 999);
      const getKnowledgePageData = getKnowledgePageRS.data;
      
      await Promise.all(getKnowledgePageData.map(async (KnowledgeItem: any)=>{
        const KnowledgeItemId = KnowledgeItem.id
        await initChatBookOpenAI(KnowledgeItemId)
        console.log("getLLMSSettingData", getLLMSSettingData, "KnowledgeItemId", KnowledgeItemId)
        console.log("process.env.OPENAI_BASE_URL", process.env.OPENAI_BASE_URL)
        enableDir(DataDir + '/uploadfiles/' + String(userId))
        enableDir(DataDir + '/uploadfiles/' + String(userId) + '/' + String(KnowledgeItemId))
        const directoryLoader = new DirectoryLoader(DataDir + '/uploadfiles/'  + String(userId) + '/' + String(KnowledgeItemId) + '/', {
          '.pdf': (path) => new PDFLoader(path),
          '.docx': (path) => new DocxLoader(path),
          '.json': (path) => new JSONLoader(path, '/texts'),
          '.jsonl': (path) => new JSONLinesLoader(path, '/html'),
          '.txt': (path) => new TextLoader(path),
          '.csv': (path) => new CSVLoader(path, 'text'),
          '.htm': (path) => new UnstructuredLoader(path),
          '.html': (path) => new UnstructuredLoader(path),
          '.ppt': (path) => new UnstructuredLoader(path),
          '.pptx': (path) => new UnstructuredLoader(path),
        });
        const rawDocs = await directoryLoader.load();
        if(rawDocs.length > 0)  {
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          });
          const SplitterDocs = await textSplitter.splitDocuments(rawDocs);
          log("parseFiles rawDocs docs count: ", rawDocs.length)
          log("parseFiles textSplitter docs count: ", SplitterDocs.length)
          log('parseFiles creating vector store begin ...');
          
          const embeddings = new OpenAIEmbeddings({openAIApiKey: getLLMSSettingData.OPENAI_API_KEY});
          const index = pinecone.Index(PINECONE_INDEX_NAME);  
          
          const PINECONE_NAME_SPACE_USE = PINECONE_NAME_SPACE + '_' + String(KnowledgeItemId)
          await PineconeStore.fromDocuments(SplitterDocs, embeddings, {
            pineconeIndex: index,
            namespace: PINECONE_NAME_SPACE_USE,
            textKey: 'text',
          });
          log('parseFiles creating vector store finished', PINECONE_NAME_SPACE_USE);
          const ParsedFiles: any[] = [];
          rawDocs.map((Item) => {
            const fileName = path.basename(Item.metadata.source);
            if(!ParsedFiles.includes(fileName)) {
              ParsedFiles.push(fileName);
            }
          });

          const UpdateFileParseStatus = db.prepare('update files set status = ? where newName = ? and knowledgeId = ? and userId = ?');
          ParsedFiles.map((Item) => {
            UpdateFileParseStatus.run(1, Item, KnowledgeItemId, userId);
            const destinationFilePath = path.join(DataDir + '/parsedfiles/', Item);
            fs.rename(DataDir + '/uploadfiles/' + String(userId) + '/' + String(KnowledgeItemId) + '/' + Item, destinationFilePath, (err) => {
              if (err) {
                log('parseFiles Error moving file:', err, Item);
              } else {
                log('parseFiles File moved successfully.', Item);
              }
            });
          });
          UpdateFileParseStatus.finalize();
          log('parseFiles change the files status finished', ParsedFiles);
          
        }
        else {
          log('parseFiles No files need to parse');
        }
      }))
    } catch (error: any) {
      log('parseFiles Failed to ingest your data', error);
    }
  }

  export async function initChatBookGeminiStream(knowledgeId: number | string) {
    getLLMSSettingData = await getLLMSSetting(knowledgeId);
    console.log("Gemini getLLMSSettingData", getLLMSSettingData, knowledgeId)
    const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
    const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
    if(OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
      if(OPENAI_API_BASE && OPENAI_API_BASE !='' && OPENAI_API_BASE.length > 16) {
        process.env.OPENAI_BASE_URL = OPENAI_API_BASE
        process.env.OPENAI_API_KEY = OPENAI_API_KEY
      }
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
  }

  export async function chatChatGemini(res: NextApiResponse, knowledgeId: number | string, question: string, history: any[]) {
    await initChatBookGeminiStream(knowledgeId)
    const input2 = [
        new HumanMessage({
          content: [
            {
              type: "text",
              text: question,
            },
          ],
        }),
      ];    
    const res3 = await ChatGeminiModel.stream(input2);
    let response = '';
    for await (const chunk of res3) {
        //console.log(chunk.content);
        res.write(chunk.content);
        response = response + chunk.content
    }
    const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)');
    insertChatLog.run(knowledgeId, question, response, userId, Date.now(), JSON.stringify([]), JSON.stringify(history));
    insertChatLog.finalize();
  }

  export async function initChatBookBaiduWenxinStream(knowledgeId: number | string) {
    getLLMSSettingData = await getLLMSSetting(knowledgeId);
    console.log("BaiduWenxin getLLMSSettingData", getLLMSSettingData, knowledgeId)
    const BAIDU_API_KEY = getLLMSSettingData.BAIDU_API_KEY ?? "1AWXpm1Cd8lbxmAaFoPR0dNx";
    const BAIDU_SECRET_KEY = getLLMSSettingData.BAIDU_SECRET_KEY ?? "TQy5sT9Mz4xKn0tR8h7W6LxPWIUNnXqq";
    const OPENAI_Temperature = getLLMSSettingData.Temperature ?? 1;
    if(BAIDU_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
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
  }

  export async function chatChatBaiduWenxin(knowledgeId: number | string, question: string, history: any[]) {
    await initChatBookBaiduWenxinStream(knowledgeId);
    const input2 = [new HumanMessage(question)];
    const response = await ChatBaiduWenxinModel.call(input2);
    console.log("response", response.content);
    const insertChatLog = db.prepare('INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)');
    insertChatLog.run(knowledgeId, question, response.content, userId, Date.now(), JSON.stringify([]), JSON.stringify(history));
    insertChatLog.finalize();

    return response.content;
  }




