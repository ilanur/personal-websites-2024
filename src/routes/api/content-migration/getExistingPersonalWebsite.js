import { DeliveryClient } from '$lib/utils/contensis/_clients'

// Function to check if personal website exists and get its data
export async function getExistingPersonalWebsite(personalSite = '') {
	try {
		const results = await DeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'websiteSlug', equalTo: personalSite.split('/').pop() || '' }
			]
		})

		return results.items.length ? results.items[0] : null
	} catch (e) {
		console.error('Error checking for existing personal website:', e)
		return null
	}
}
