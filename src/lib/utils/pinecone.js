import { Pinecone } from '@pinecone-database/pinecone';
import {
	SECRET_PINECONE_API_KEY,
	SECRET_PINECONE_ENVIRONMENT,
	SECRET_PINECONE_INDEX
} from '$env/static/private';

const client = new Pinecone({
	apiKey: SECRET_PINECONE_API_KEY,
	environment: SECRET_PINECONE_ENVIRONMENT
});

export const pineconeIndex = client.Index(SECRET_PINECONE_INDEX);
