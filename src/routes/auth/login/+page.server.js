import { redirect } from '@sveltejs/kit';
import { signIn } from '../../../auth';
import useDirectus from '$lib/composables/useDirectus';

export const actions = { default: signIn };

export async function load(event) {
	const session = await event.locals.auth();

	if (session) {
		// Check if user exists in Directus, if not create a record.
		try {
			const { readUsersByEmail, createUserWithMicrosoft } = useDirectus();
			const readUserResponse = await readUsersByEmail(session.user.email);

			if (!readUserResponse.length) {
				await createUserWithMicrosoft(session);
			}
		} catch (error) {
			console.log('Error', error);
		}

		return redirect(302, '/');
	}

	return {};
}
