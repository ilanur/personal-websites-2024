import { error, fail, json, redirect } from '@sveltejs/kit'
import { PRIVATE_DIRECTUS_ROLE_REGULAR_USER_ID } from '$env/static/private'
import useDirectus from '$lib/composables/useDirectus.js'
import useAlgolia from '$lib/composables/useAlgolia.js'
import getPersonalWebsiteByUserSlug from '$lib/utils/contensis/getPersonalWebsiteByUserSlug.js'

export async function load(event) {
	const { getAlgoliaUserByEmail } = useAlgolia()

	const session = await event.locals.auth()

	if (!session) redirect(302, '/')

	// const algoliaUser = await getAlgoliaUserByEmail(session.user.email);
	const algoliaUser = await getAlgoliaUserByEmail('emanuele.strano@eui.eu')

	if (!algoliaUser) redirect(302, '/')

	return { algoliaUser }
}

export const actions = {
	default: async ({ request, locals, url }) => {
		try {
			console.log('url', url)
			const session = await locals.auth()
			const { getAlgoliaUserByEmail } = useAlgolia()
			const { createUser, readUsersByEmail, createPersonalInformationItem, createPages } =
				useDirectus()

			const formData = Object.fromEntries(await request.formData())
			// const algoliaUser = await getAlgoliaUserByEmail(session.user.email);
			const algoliaUser = await getAlgoliaUserByEmail('emanuele.strano@eui.eu')

			console.log('formData', formData)

			// TEMP
			formData.email = 'PieterJan.DeRidder@ext.eui.eu'

			// Create slug.
			const slug = formData.slug.split('/')[formData.slug.split('/').length - 1]

			// Check if personal website already exists in Contensis.
			let personalWebsite
			try {
				personalWebsite = await getPersonalWebsiteByUserSlug(slug)
			} catch (e) {
				console.log('User not found in Contensis')
				return fail(404, { error: 'User not found in Contensis' })
			}

			console.log('User in contensis')

			// const userInDirectus = await readUsersByEmail(formData.email)

			// if (userInDirectus.length) {
			// 	return fail(400, {
			// 		error: 'User already exists'
			// 	});
			// }

			// // 1. Create user record in Directus.
			// const createdUser = await createUser(formData);

			// if (!createdUser) fail(400, { error: 'Something went wrong while adding the user' });

			// console.log('createduser', createdUser);

			// // 2. Create a Personal information record.
			// const personalInformationRes = await createPersonalInformationItem({
			// 	slug: algoliaUser.objectID,
			// 	name: createdUser.title,
			// 	user_id: createdUser.id,
			// 	email: createdUser.email,
			// 	nationality: formData.nationality,
			// 	role: PRIVATE_DIRECTUS_ROLE_REGULAR_USER_ID
			// });

			// await createPages([
			// 	{
			// 		title: 'About',
			// 		slug: 'about',
			// 		personal_information_id: personalInformationRes.id,
			// 		sort: 0
			// 	},
			// 	{
			// 		title: 'Research',
			// 		slug: 'research',
			// 		personal_information_id: personalInformationRes.id,
			// 		sort: 1
			// 	},
			// 	{
			// 		title: 'Teaching',
			// 		slug: 'teaching',
			// 		personal_information_id: personalInformationRes.id,
			// 		sort: 2
			// 	},
			// 	{
			// 		title: 'Publications',
			// 		slug: 'publications',
			// 		personal_information_id: personalInformationRes.id,
			// 		sort: 0
			// 	}
			// ]);

			// redirect(302, `/${personalInformationRes.slug}`);

			json({ success: true }, { status: 200 })
		} catch (e) {
			console.log('Error while creating personal website:', e)
			error(e.status, e.data)
		}
	}
}
