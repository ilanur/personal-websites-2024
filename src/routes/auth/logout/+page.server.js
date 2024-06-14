import { redirect } from '@sveltejs/kit';
import { signOut } from '../../../auth';

export const actions = { default: signOut };

export async function load() {
	await signOut();
	redirect('/');
}
