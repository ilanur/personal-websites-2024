import { ofetch } from 'ofetch'
import { PUBLIC_CONTENSIS_DELIVERY_URL } from '$env/static/public'
import { PRIVATE_CONTENSIS_ACCESS_TOKEN } from '$env/static/private'

async function deliverySearch(payload, linkDepth = 0, contensisProject = 'personalWebsites') {
	const url = `${PUBLIC_CONTENSIS_DELIVERY_URL}/${contensisProject}/entries/search?accessToken=${PRIVATE_CONTENSIS_ACCESS_TOKEN}&linkDepth=${linkDepth}`
	const entries = await ofetch(url, {
		method: 'POST',
		body: payload
	})

	if (!entries || !entries.items || !entries.items.length) return []

	return entries.items
}

export default deliverySearch
