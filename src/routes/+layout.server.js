import algoliasearch from 'algoliasearch';
import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';

export async function load(event) {
	// let session = await event.locals.getSession();
	let session = [];
	const client = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
	const index = client.initIndex('people');

	// Get algolia entry from search email on a specific field called ict.EuiEmail
	// const algoliaEntry = await index.search(session.user.email);
	const algoliaEntry = await index.search('emanuele.strano@eui.eu'); //TODO: remove hardcoded email
	const algoliaUser = algoliaEntry.hits[0];
	session.algoliaUser = algoliaUser;

	return {
		session: session
	};
}


/////CODE EXTRACTED FROM DIFFERENT PROJECT, NEEDS ADJUSTMENTS - AZURE AUTHENTICATION

// export async function load(event) {
// 	let isLoggedIn = false;
// 	const session = await event.cookies.get('session');
// 	const user_id = await event.cookies.get('user_id');
// 	const magicLink_user = await event.cookies.get('magicLink_user');
// 	const refresh_token = await event.cookies.get('session_refresh');

// 	if (session && user_id) {
// 		isLoggedIn = true;
// 	}

// 	return {
// 		session: session,
//         refresh_token: refresh_token,
// 		user_id: user_id,
// 		magicLink_user: magicLink_user,
// 		isLoggedIn: isLoggedIn
// 	};
// }