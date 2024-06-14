import { redirect } from '@sveltejs/kit';
import { signIn } from '../../../auth';

export const actions = { default: signIn };

export async function load(event) {
	const session = await event.locals.getSession();

	if (session) {
		redirect(302, '/');
	}

	return {};
}
