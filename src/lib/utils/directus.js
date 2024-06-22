import { createDirectus, rest } from '@directus/sdk';
import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';

export function getDirectusInstance(fetch) {
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(PUBLIC_DIRECTUS_API_URL, options).with(rest());
	return directus;
}
