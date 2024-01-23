import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX } from '$env/static/private';


const client = new Pinecone({
    apiKey: PINECONE_API_KEY,
    environment: PINECONE_ENVIRONMENT,
});


export const pineconeIndex = client.Index(PINECONE_INDEX);