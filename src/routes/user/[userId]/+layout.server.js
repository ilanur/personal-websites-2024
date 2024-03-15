import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	if (!params.userId) throw redirect(302, '/');

	const res = await fetch(`https://dummyjson.com/users/${params.userId}`);
	const user = await res.json();

	return {
		user
	};
}
