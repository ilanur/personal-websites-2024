import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_MANAGEMENT_URL } from '$env/static/public'
import { PRIVATE_CONTENSIS_ACCESS_TOKEN } from '$env/static/private'

async function listEntriesByContentType(
	contentTypeId,
	pageSize = 999999,
	contensisProject = 'personalWebsites'
) {
	try {
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/${contensisProject}/contenttypes/${contentTypeId}/entries`
		const entries = await ofetch(url, {
			query: {
				accessToken: PRIVATE_CONTENSIS_ACCESS_TOKEN,
				pageSize
			}
		})

		if (!entries || !entries.items || !entries.items.length) return []

		return entries.items
	} catch (e) {
		console.error('Error while listing entries by content type:', e)
		error(e.status, e.data)
	}
}

export default listEntriesByContentType
