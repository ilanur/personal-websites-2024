/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/utils/directus';
import { readItems } from '@directus/sdk';

export async function load({ fetch }) {
	const directus = getDirectusInstance(fetch);
	const pages = await directus.request(readItems('Pages'))
	console.log(pages);
	return {
		global: pages
	};
}
