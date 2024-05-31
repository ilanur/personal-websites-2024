import { getPageContent } from '$lib/utils/directus.js';

export async function load({ parent }) {
	const parentRes = await parent();
	const userId = parentRes.user.id;

	return {
		page: await getPageContent(userId, 'about')
	};
}
