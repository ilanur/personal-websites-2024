import algoliasearch from 'algoliasearch';
import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';

export async function load(event) {
	let session = await event.locals.getSession();

	const client = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
	const index = client.initIndex('people');

	//get algolia entry from search email on a specific field called ict.EuiEmail
	const algoliaEntry = await index.search(session.user.email);
	//console.log(algoliaEntry.hits[0]);
	const algoliaUser = algoliaEntry.hits[0];
	session.algoliaUser = algoliaUser;

	return {
		session: session
	};
}
