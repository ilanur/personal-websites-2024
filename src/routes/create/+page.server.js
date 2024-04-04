import algoliasearch from 'algoliasearch';
import { PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import { getDirectusInstance } from '$lib/utils/directus.js';

export async function load() {
	// let session = await event.locals.getSession();
	let session = [];
	const client = algoliasearch(PUBLIC_ALGOLIA_ID, PUBLIC_ALGOLIA_KEY);
	const index = client.initIndex('people');

	// Get algolia entry from search email on a specific field called ict.EuiEmail
	// const algoliaEntry = await index.search(session.user.email);
	const algoliaEntry = await index.search('emanuele.strano@eui.eu'); //TODO: remove hardcoded email
	const algoliaUser = algoliaEntry.hits[0];
	session.algoliaUser = algoliaUser;

	// console.log('session', session);

	return {
		user: session.algoliaUser
	};
}

export const actions = {
	default: async ({ request }) => {
		const client = getDirectusInstance();
		const formData = Object.fromEntries(await request.formData());
		const { fileToUpload } = formData;

		console.log('formData', formData);

		if (fileToUpload) {
			// Check if a new image is uploaded.
			if (!fileToUpload.name || !fileToUpload.name === 'undefined') {
				return fail(500, {
					error: true,
					message: 'You must provide a file to upload'
				});
			}
		}

		// TODO: Add data to directus once authentication works.
	}
};
