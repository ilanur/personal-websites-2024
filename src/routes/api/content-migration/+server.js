import slugify from 'slugify';
import { json, error } from '@sveltejs/kit';
import { withToken, readItems, deleteItems, createItem } from '@directus/sdk';
import { getDirectusInstance } from '../../../lib/utils/directus';
import { DIRECTUS_API_KEY } from '$env/static/private';

export const GET = async () => {
	const personalInformationCollection = 'Personal_information_TEST';
	const pagesCollection = 'Pages_TEST';

	try {
		// 1. Collect old CMS data from Wordpress.
		const res = await fetch('https://me.eui.eu/wp-json/eui/v1/sites');
		const data = await res.json();

		// 2. Get Directus instance.
		const directus = getDirectusInstance();

		// 3. Flush Personal data collection.
		await directus.request(
			withToken(
				DIRECTUS_API_KEY,
				deleteItems(personalInformationCollection, {
					filter: {
						query: {
							limit: -1
						}
					}
				})
			)
		);

		// 4. Loop through data and create items in Directus.
		for (let i = 0, ilen = data.length; i < ilen; i++) {
			const personalData = data[i];

			// 5. Check if personal information is already in Directus.
			// This step could be removed since we are flushing the collections.
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

			// 6. Add personal information and pages
			// to empty array to post to Directus.
			if (!usersInDirectus.length) {
				const createdUser = await directus.request(
					withToken(
						DIRECTUS_API_KEY,
						createItem(personalInformationCollection, {
							email: personalData.user.user_email,
							display_name: personalData.user.display_name,
							slug: slugify(personalData.user.display_name, { lower: true })
						})
					)
				);

				if (createdUser) {
					for (let j = 0, jlen = personalData.pages.length; j < jlen; j++) {
						const page = personalData.pages[j];

						await directus.request(
							withToken(
								DIRECTUS_API_KEY,
								createItem(pagesCollection, {
									related_personal_info: createdUser.id,
									title: page.title.rendered,
									content: page.content.rendered,
									slug: slugify(page.title.rendered, { lower: true })
								})
							)
						);
					}
				}
			}
		}

		return json('OK');
	} catch (err) {
		console.log(err.errors[0]);
		throw error(500, 'Error migrating the content!');
	}
};
