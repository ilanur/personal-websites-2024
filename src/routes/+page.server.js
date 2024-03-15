import getDirectusInstance from '$lib/utils/directus';
import { readItems } from '@directus/sdk';

export async function load() {
	const directus = getDirectusInstance(fetch);
	const users = await directus.request(readItems('Personal_information'));

	return {
		users
	};
}
