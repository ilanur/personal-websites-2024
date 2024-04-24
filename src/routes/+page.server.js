import { getDirectusInstance, getCurrentUser } from '$lib/utils/directus';
import { readItems } from '@directus/sdk';
import { PUBLIC_PERSONAL_INFORMATION_COLLECTION } from '$env/static/public';

export async function load() {
	const directus = getDirectusInstance(fetch);
	const users = await directus.request(
		readItems(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
			sort: ['display_name']
		})
	);
	const current_user = await getCurrentUser();
	// console.log('current_user!', current_user);
	return {
		users
	};
}
