import { readItems } from '@directus/sdk';
import { getDirectusInstance } from '$lib/utils/directus';
import { PUBLIC_PERSONAL_INFORMATION_COLLECTION } from '$env/static/public';

export async function load() {
	const directus = getDirectusInstance(fetch);
	const users = await directus.request(
		readItems(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
			sort: ['name']
		})
	);

	return {
		users
	};
}
