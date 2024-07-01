import { writable, get } from 'svelte/store';
import {
	PUBLIC_ALGOLIA_PEOPLE_INDEX,
	PUBLIC_ALGOLIA_ID,
	PUBLIC_ALGOLIA_KEY
} from '$env/static/public';
import algoliasearch from 'algoliasearch';

const algoliaClient = writable(null);

function initializeAlgolia() {
	algoliaClient.set(algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY));
}

export default function useAlgolia() {
	if (!get(algoliaClient)) initializeAlgolia();

	async function getAlgoliaUserByEmail(email) {
		const index = get(algoliaClient).initIndex(PUBLIC_ALGOLIA_PEOPLE_INDEX);
		const entry = await index.search(email);
		const algoliaUser = entry.hits.length ? entry.hits[0] : undefined;
		return algoliaUser;
	}

	return {
		getAlgoliaUserByEmail
	};
}
