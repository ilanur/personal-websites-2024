import { PUBLIC_ALGOLIA_ID } from '$env/static/public';
import { SECRET_ALGOLIA_WRITEKEY } from '$env/static/private';

import algoliasearch from 'algoliasearch';

export async function saveToAlgolia(data, indexName) {
	try {
		const algoliaClient = algoliasearch(PUBLIC_ALGOLIA_ID, SECRET_ALGOLIA_WRITEKEY);

		const index = algoliaClient.initIndex(indexName);
		const result = await index.saveObject(data);
		console.log(`Data saved to Algolia index ${indexName}:`, result);
		return result;
	} catch (error) {
		console.error(`Error saving to Algolia index ${indexName}:`, error);
	}
}

export async function deleteFromAlgolia(objectID, indexName) {
	try {
		const algoliaClient = algoliasearch(PUBLIC_ALGOLIA_ID, SECRET_ALGOLIA_WRITEKEY);

		const index = algoliaClient.initIndex(indexName);
		const result = await index.deleteObject(objectID);
		console.log(`Object deleted from Algolia index ${indexName}:`, result);
		return result;
	} catch (error) {
		console.error(`Error deleting from Algolia index ${indexName}:`, error);
	}
}