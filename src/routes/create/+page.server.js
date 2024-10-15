import { error, json, redirect } from '@sveltejs/kit'
import getComponentById from '$lib/utils/contensis/getComponentById.js'
import getPeopleEntryByEmail from '$lib/utils/contensis/getPeopleEntryByEmail.js'

export async function load(event) {
	const session = await event.locals.auth()

	if (!session) redirect(302, '/')

	const contensisUser = await getPeopleEntryByEmail('emanuele.strano@eui.eu')
	// const contensisUser = await getPeopleEntryByEmail('session.user.email') --> Enable this line to use real user

	if (!contensisUser) redirect(302, '/')

	const nationalities = await getComponentById('nationalities')

	return { contensisUser, nationalities }
}

export const actions = {
	default: async ({ request, locals, url }) => {
		try {
			// const session = await locals.auth()

			const formData = Object.fromEntries(await request.formData())
			console.log('Form data', formData)

			// Get user from Contensis
			const contensisUser = await getPeopleEntryByEmail('emanuele.strano@eui.eu')

			console.log('contensisUser', contensisUser)

			// TEMP
			// formData.email = 'PieterJan.DeRidder@ext.eui.eu'

			// Create slug.
			// const slug = formData.slug.split('/')[formData.slug.split('/').length - 1]

			// Check if personal website already exists in Contensis.
			// let personalWebsite
			// try {
			// 	personalWebsite = await getPersonalWebsiteByUserSlug(slug)
			// } catch (e) {
			// 	console.log('User not found in Contensis')
			// 	return fail(404, { error: 'User not found in Contensis' })
			// }

			// console.log('User in contensis')

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
