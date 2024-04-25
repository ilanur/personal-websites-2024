import slugify from 'slugify';
import { json, error } from '@sveltejs/kit';
import { withToken, readItems, deleteItems, createItem, createItems } from '@directus/sdk';
import { getDirectusInstance } from '../../../lib/utils/directus';
import { DIRECTUS_API_KEY } from '$env/static/private';
import {
	PUBLIC_PAGES_COLLECTION,
	PUBLIC_PERSONAL_INFORMATION_COLLECTION
} from '$env/static/public';

export const GET = async () => {
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
				deleteItems(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
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
				readItems(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
					filter: {
						email: {
							_eq: personalData.user.user_email
						}
					}
				})
			);

			// 6. Add personal information and pages
			// to empty array to post to Directus.
			if (!usersInDirectus.length) {
				const createdUser = await directus.request(
					withToken(
						DIRECTUS_API_KEY,
						createItem(PUBLIC_PERSONAL_INFORMATION_COLLECTION, {
							description: personalData.description,
							email: personalData.user.user_email,
							display_name: personalData.user.display_name,
							slug: slugify(personalData.user.display_name, { lower: true }),
							socials: {
								facebook: personalData.user.facebook,
								google_scholar: personalData.user.google_scholar,
								research_gate: personalData.user.research_gate,
								linkedin: personalData.user.linkedin,
								twitter: personalData.user.twitter,
								instagram: personalData.user.instagram,
								pinterest: personalData.user.pinterest,
								skype: personalData.user.skype,
								academia: personalData.user.academia,
								orcid_id: '',
								youtube: '',
								github: ''
							}
						})
					)
				);

				if (createdUser) {
					let pages = [];

					for (let j = 0, jlen = personalData.pages.length; j < jlen; j++) {
						const page = personalData.pages[j];
						let title = page.title.rendered;

						if (page.title.rendered === 'Biography') {
							title = 'About';
						}

						if (page.title.rendered === 'List of publications') {
							title = 'Publications';
						}

						pages.push({
							related_personal_info: createdUser.id,
							title,
							content: page.content.rendered,
							slug: slugify(title, { lower: true })
						});
					}

					pages = pages.filter(
						(page) =>
							page.title !== 'Blog' &&
							page.title !== 'Contact Me' &&
							page.title !== 'Personal Website Settings'
					);

					await directus.request(
						withToken(DIRECTUS_API_KEY, createItems(PUBLIC_PAGES_COLLECTION, pages))
					);
				}
			}
		}

		return json('OK');
	} catch (err) {
		console.log(err.errors[0]);
		throw error(500, 'Error migrating the content!');
	}
};
