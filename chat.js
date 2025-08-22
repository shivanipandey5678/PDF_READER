import 'dotenv/config';
import { OpenAI } from 'openai';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";



async function chat() {

    const SYSTEM_PROMPT = `
    you reply around your given  context if someone ask from outside say politely that sorry i can not give u ans about this this is not releted to my context
    ,while giving answer if it is from your context please always mention the source location like page number book name and all in clear way i gave you answer from this place
    `

    let USER_PROMPT = `
    what is web workers
 `;
    
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        
    
    });

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "Rag-assignemnt4",
    }
    );

    const vector_search = vectorStore.asRetriever({
        k: 3
    });

    const relaventChunk = await vector_search.invoke(USER_PROMPT);

 

 const messages= [
    {role:'system', content:SYSTEM_PROMPT},
    {role:'user', content:USER_PROMPT}
 ]

const response=await  client.chat.completions.create({
     model:'gpt-4o-mini',
     messages
 });

console.log(`> ${response.choices[0].message.content}`)

}

chat();