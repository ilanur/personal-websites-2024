// import { error, json } from '@sveltejs/kit';
// import { OPENAI_API_KEY } from '$env/static/private';
// import { PineconeStore } from "@langchain/pinecone";
// import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
// import { pineconeIndex } from '$lib/utils/pinecone';
// import {ChatOpenAI} from "@langchain/openai";
// import { RetrievalQAChain } from "langchain/chains";

// const QA_TEMPLATE = `You are an AI assistant for the EUI (European University Institute) located in Florence, Italy. Use the pieces of context retrieved from the files to answer the user question. You can also give info on files.
// If you don't know the answer, just say you don't know or ask for more info. DO NOT try to make up an answer.
// If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the EUI.`;

// const CONDENSE_TEMPLATE = `Given the following conversation and a follow-up question, rephrase the follow-up question into a standalone question that can be understood independently.

// Chat History:
// {chat_history}

// Follow-Up Input:
// {question}

// Standalone Question:`;

// export const POST = (async ({ request }) => {
// 	const { text } = await request.json();
// 	if (!text) {
// 		throw error(400, 'Missing text');
// 	}
// 	if (text.length > 200) {
// 		throw error(400, 'Text too long');
// 	}

// 	try {
// 		const embeddings = new OpenAIEmbeddings({
// 			openAIApiKey: OPENAI_API_KEY
// 		});

// 		const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

// 		const model = new ChatOpenAI({ temperature: 0.9, openAIApiKey: OPENAI_API_KEY, modelName: 'gpt-3.5-turbo' });

// 		const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
//             qaTemplate: QA_TEMPLATE,
//             questionGeneratorTemplate: CONDENSE_TEMPLATE,
// 			k: 5,
// 			returnSourceDocuments: true
// 		});

// 		const response = await chain.call({ query: text });

// 		const { text: responseText, sourceDocuments } = response;

// 		return json({
// 			text: responseText,
// 			source: sourceDocuments[0]?.pageContent ?? 'No source document found'
// 		});
// 	} catch (e) {
// 		console.log(e);
// 		throw error(500, 'Internal Server Error');
// 	}
// });
