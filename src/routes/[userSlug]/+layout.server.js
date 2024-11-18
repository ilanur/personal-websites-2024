import { redirect } from '@sveltejs/kit'
import { PwDeliveryClient } from '$lib/utils/contensis-clients.js'

export async function load({ params }) {
	if (!params.userSlug) throw redirect(302, '/')

	const results = await PwDeliveryClient.entries.search(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsite' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'websiteSlug', equalTo: params.userSlug }
			]
		},
		1
	)

	return {
		personalWebsite: results.items.length ? results.items[0] : null
	}
}
