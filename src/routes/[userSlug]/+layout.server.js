import {getDirectusInstance} from '$lib/utils/directus';
import { readItems } from '@directus/sdk';

export async function load({ params }) {
	if (!params.userSlug) throw redirect(302, '/');

	const directus = getDirectusInstance(fetch);

	// Get user
	const user = await directus.request(
		readItems('Personal_information', {
			filter: {
				slug: {
					_eq: params.userSlug
				}
			}
		})
	);

	// Get pages for that specific user
	const userPages = await directus.request(
		readItems('Pages', {
			filter: {
				related_personal_info: {
					_eq: user[0].id
				}
			}
		})
	);

	console.log('userPages', userPages);

	return {
		user: user[0],
		userPages
	};
}
