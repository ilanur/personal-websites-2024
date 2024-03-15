/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/utils/directus';
import { readItems } from '@directus/sdk';

export async function load({ fetch }) {
	const directus = getDirectusInstance(fetch);
	return {
		global: await directus.request(readItems('Pages'))
	};
}
