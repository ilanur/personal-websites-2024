import { redirect } from '@sveltejs/kit'
import { getPersonalWebsiteByUserSlug } from '$lib/utils/contensis.js'

export async function load({ params }) {
	if (!params.userSlug) throw redirect(302, '/')

	const personalWebsite = await getPersonalWebsiteByUserSlug(params.userSlug)

	return {
		personalWebsite
	}
}
