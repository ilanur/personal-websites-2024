import { signIn } from '../../../auth';
import { redirect } from '@sveltejs/kit';
import useDirectus from '$lib/composables/useDirectus';

export const actions = { default: signIn };

export async function load(event) {
	const session = await event.locals.auth();

	if (session) {
		const { readUsersByEmail, createUserWithMicrosoft } = useDirectus();
		const readUserResponse = await readUsersByEmail(session.user.email);

		if (readUserResponse.length) redirect(302, '/');

		await createUserWithMicrosoft(session);

		redirect(302, '/');
	}

	return {};
}
