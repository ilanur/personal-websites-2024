// import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
// import * as directus from '@directus/sdk';

// export async function load(event) {
// 	// Code from José. Wait untill they have replied.
// 	const client = directus
// 		.createDirectus(PUBLIC_DIRECTUS_API_URL)
// 		.with(directus.authentication('cookie', { credentials: 'include' }))
// 		.with(directus.rest());

// 	const result = await client.request(
// 		directus.withOptions(directus.refresh(), { credentials: 'include' })
// 	);

// 	console.log('refresh', result);
// }
