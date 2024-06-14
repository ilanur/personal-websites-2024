import { createDirectus, readItems, rest } from '@directus/sdk';
import { PUBLIC_DIRECTUS_API_URL, PUBLIC_PAGES_COLLECTION } from '$env/static/public';

export function getDirectusInstance(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(PUBLIC_DIRECTUS_API_URL, options).with(rest());
	return directus;
}

export async function getPageContent(userId, pageSlug) {
	const directus = getDirectusInstance();

	const response = await directus.request(
		readItems(PUBLIC_PAGES_COLLECTION, {
			filter: {
				related_personal_info: {
					_eq: userId
				},
				slug: {
					_eq: pageSlug
				}
			}
		})
	);

	if (response.length) return response[0];

	return [];
}
