import { signIn } from '../../../auth';
import { redirect } from '@sveltejs/kit';

export const actions = { default: signIn };

export async function load(event) {
	const session = await event.locals.auth();

	if (session) redirect(302, '/');

	return {};
}
