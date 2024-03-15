/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/utils/directus';
import { readItems, readItem } from '@directus/sdk';

export async function load({ fetch, params }) {
	if (!params.userId) throw redirect(302, '/');

	const directus = getDirectusInstance(fetch);
	const pages = await directus.request(
		readItems('Pages', {
			filter: {
				slug: {
					_eq: 'research'
				}
			}
		})
	);

	console.log('pages', pages);

	return {
		global: pages
	};
}
