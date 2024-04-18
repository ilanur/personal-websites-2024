import { json } from '@sveltejs/kit';
import { createItems, withToken, readItems } from '@directus/sdk';
import { getDirectusInstance } from '../../../lib/utils/directus';
import { DIRECTUS_API_KEY } from '$env/static/private';

export const GET = async () => {
	const personalInformationCollection = 'Personal_information_TEST';

	// 1. Collect old CMS data from Wordpress.
	const res = await fetch('https://me.eui.eu/wp-json/eui/v1/sites');
	const data = await res.json();

	// 2. Get Directus instance.
	const directus = getDirectusInstance();

	// 3. Loop through data and push personal information
	// that doesn't exist in Directus to empty array.
	const personalInformation = [];

	for (let i = 0, ilen = data.length; i < ilen; i++) {
		const personalData = data[i];

		// 4. Check if personal information is already in Directus.
		const usersInDirectus = await directus.request(
			withToken(
				DIRECTUS_API_KEY,
				readItems(personalInformationCollection, {
					filter: {
						email: {
							_eq: personalData.user.user_email
						}
					}
				})
			)
		);

		// 5. Add personal information to empty array to post to directus.
		if (!usersInDirectus.length) {
			personalInformation.push({
				email: personalData.user.user_email,
				display_name: personalData.user.display_name
			});
		}
	}

	await directus.request(
		withToken(DIRECTUS_API_KEY, createItems(personalInformationCollection, personalInformation))
	);

	return json('OK');
};
