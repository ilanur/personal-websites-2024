import { error } from '@sveltejs/kit'
import deliverySearch from './deliverySearch'

async function getPersonalWebsiteBySlug(slug) {
	try {
		const personalWebsite = await deliverySearch(
			{
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'personalWebsite' },
					// { field: 'sys.versionStatus', equalTo: 'draft' },
					{ field: 'websiteSlug', equalTo: slug }
				]
			},
			1
		)

		if (!personalWebsite || !personalWebsite.length) return null

		return personalWebsite[0]
	} catch (e) {
		console.error('Error while getting personal website:', e.data)
		if (e.status === 404) return null
		error(e.status, e.data)
	}
}

export default getPersonalWebsiteBySlug
