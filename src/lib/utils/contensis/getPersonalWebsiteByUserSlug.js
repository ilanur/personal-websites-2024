import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_DELIVERY_URL } from '$env/static/public'
import { PRIVATE_CONTENSIS_ACCESS_TOKEN } from '$env/static/private'

async function getPersonalWebsiteByUserSlug(
	slug,
	versionStatus = 'published',
	contensisProject = 'personalWebsites'
) {
	try {
		const url = `${PUBLIC_CONTENSIS_DELIVERY_URL}/${contensisProject}/entries/${slug}`
		const data = await ofetch(url, {
			query: {
				accessToken: PRIVATE_CONTENSIS_ACCESS_TOKEN,
				versionStatus,
				linkDepth: 1
			}
		})

		return data
	} catch (e) {
		console.error('Error while getting Contensis data:', e.data)
		error(e.status, e.data)
	}
}

export default getPersonalWebsiteByUserSlug
