import { error } from '@sveltejs/kit';
import { createDirectus, rest, readItem } from '@directus/sdk';

const client = createDirectus('https://eui-personal-websites.directus.app').with(rest());

export async function load({ params,  url}) {
	const slug = params.slug;
	const result = await client.request(readItem('Personal_information', slug));


	if (result) {
		return {
			result
		};
	}

	error(404, 'Not found');
}