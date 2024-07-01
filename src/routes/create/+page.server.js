import { fail, redirect } from '@sveltejs/kit';
import { PRIVATE_DIRECTUS_ROLE_REGULAR_USER_ID } from '$env/static/private';
import useDirectus from '$lib/composables/useDirectus.js';
import useAlgolia from '$lib/composables/useAlgolia.js';

export async function load(event) {
	const { getAlgoliaUserByEmail } = useAlgolia();

	const session = await event.locals.auth();

	if (!session) redirect(302, '/');

	// const algoliaUser = await getAlgoliaUserByEmail(session.user.email);
	const algoliaUser = await getAlgoliaUserByEmail('emanuele.strano@eui.eu');

	if (!algoliaUser) redirect(302, '/');

	return { algoliaUser };
}

export const actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		const { getAlgoliaUserByEmail } = useAlgolia();
		const { createUser, readUsersByEmail, createPersonalInformationItem, createPages } =
			useDirectus();

		const formData = Object.fromEntries(await request.formData());
		// const algoliaUser = await getAlgoliaUserByEmail(session.user.email);
		const algoliaUser = await getAlgoliaUserByEmail('emanuele.strano@eui.eu');

		console.log('formData', formData);

		// TEMP
		formData.email = 'PieterJan.DeRidder@ext.eui.eu';

		// if (formData.fileToUpload) {
		// 	// Check if a new image is uploaded.
		// 	if (!fileToUpload.name || !fileToUpload.name === 'undefined') {
		// 		return fail(500, {
		// 			error: true,
		// 			message: 'You must provide a file to upload'
		// 		});
		// 	}
		// }

		const userInDirectus = await readUsersByEmail(formData.email);

		if (userInDirectus.length) {
			return fail(400, {
				error: 'User already exists'
			});
		}

		// 1. Create user record in Directus.
		const createdUser = await createUser(formData);

		if (!createdUser) fail(400, { error: 'Something went wrong while adding the user' });

		console.log('createduser', createdUser);

		// 2. Create a Personal information record.
		const personalInformationRes = await createPersonalInformationItem({
			slug: algoliaUser.objectID,
			name: createdUser.title,
			user_id: createdUser.id,
			email: createdUser.email,
			nationality: formData.nationality,
			role: PRIVATE_DIRECTUS_ROLE_REGULAR_USER_ID
		});

		await createPages([
			{
				title: 'About',
				slug: 'about',
				personal_information_id: personalInformationRes.id,
				sort: 0
			},
			{
				title: 'Research',
				slug: 'research',
				personal_information_id: personalInformationRes.id,
				sort: 1
			},
			{
				title: 'Teaching',
				slug: 'teaching',
				personal_information_id: personalInformationRes.id,
				sort: 2
			},
			{
				title: 'Publications',
				slug: 'publications',
				personal_information_id: personalInformationRes.id,
				sort: 0
			}
		]);

		redirect(302, `/${personalInformationRes.slug}`);
	}
};
