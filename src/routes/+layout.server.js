import algoliasearch from 'algoliasearch';
import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';

export async function load(event) {
	
	//let session = await event.locals.getSession();
	let session = [];
	const client = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
	const index = client.initIndex('people');

	//get algolia entry from search email on a specific field called ict.EuiEmail
	//const algoliaEntry = await index.search(session.user.email);
	const algoliaEntry = await index.search("emanuele.strano@eui.eu"); //TODO: remove hardcoded email
	const algoliaUser = algoliaEntry.hits[0];
	session.algoliaUser = algoliaUser;

	return {
		session: session
	};
	
}
