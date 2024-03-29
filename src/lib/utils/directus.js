import { createDirectus, rest } from '@directus/sdk';
import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';

export function getDirectusInstance(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(PUBLIC_DIRECTUS_API_URL, options).with(rest());
	return directus;
}

export async function getCurrentUser() {
	const my_user = await fetch(`${PUBLIC_DIRECTUS_API_URL}/users/me`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: 'application/json'
		}
	});
	const my_data = await my_user.json();
	// console.log("qui",my_data);
	return my_data.data;
}
