import { error } from '@sveltejs/kit';

export async function load({ params,  url}) {
	let is_preview = false;
	if(url.hostname =="hostname"){
		is_preview = true;
	}
	let slug = '/en/eui-intranet/' + params.slug;
	//get entry by slug
	const entry = await get_entryBySlug(slug, is_preview);
	if (entry) {
		return {
			entry
		};
	}

	error(404, 'Not found');
}