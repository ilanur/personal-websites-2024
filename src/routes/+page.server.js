import { getDirectusInstance, getCurrentUser } from '$lib/utils/directus';
import { readItems } from '@directus/sdk';

export async function load() {
	const directus = getDirectusInstance(fetch);
	const users = await directus.request(readItems('Personal_information'));
	const current_user = await getCurrentUser();
	// console.log('current_user!', current_user);
	return {
		users
	};
}
