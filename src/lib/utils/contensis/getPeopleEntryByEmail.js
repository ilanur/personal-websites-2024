import { error } from '@sveltejs/kit'
import { DeliveryClient } from '$lib/utils/contensis-clients'

async function getPeopleEntryByEmail(email) {
	try {
		const contensisUsers = await DeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'people' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'euiEmail', equalTo: email }
			]
		})

		if (!contensisUsers.items.length) return null

		return contensisUsers.items[0]
	} catch (e) {
		console.error('Error while getting people entry:', e.data)
		if (e.status === 404) return null
		error(e.status, e.data)
	}
}

export default getPeopleEntryByEmail
