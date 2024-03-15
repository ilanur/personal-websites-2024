import getDirectusInstance from '$lib/utils/directus';
import { readItems } from '@directus/sdk';

export async function load({ params }) {
	if (!params.userId) throw redirect(302, '/');

	const directus = getDirectusInstance(fetch);
	const user = await directus.request(
		readItems('Personal_information', {
			filter: {
				slug: {
					_eq: params.userId
				}
			}
		})
	);

	console.log('USER', user);

	return {
		user: user[0]
	};
}
