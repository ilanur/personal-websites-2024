import { getDirectusInstance } from '$lib/utils/directus';
import { readItems } from '@directus/sdk';
import {
	PUBLIC_PERSONAL_INFORMATION_COLLECTION,
	PUBLIC_PAGES_COLLECTION
} from '$env/static/public';

export async function load({ params }) {
	if (!params.userSlug) throw redirect(302, '/');

	const directus = getDirectusInstance(fetch);

	// Get user
	const user = await directus.request(
		readItems(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
			filter: {
				slug: {
					_eq: params.userSlug
				}
			}
		})
	);

	// Get pages for that specific user
	const userPages = await directus.request(
		readItems(PUBLIC_PAGES_COLLECTION, {
			filter: {
				related_personal_info: {
					_eq: user[0].id
				}
			}
		})
	);

	return {
		user: user[0],
		userPages
	};
}
