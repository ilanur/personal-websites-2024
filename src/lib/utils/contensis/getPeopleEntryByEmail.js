import { error } from '@sveltejs/kit'
import deliverySearch from './deliverySearch'

async function getPeopleEntryByEmail(email) {
	try {
		const contensisUser = await deliverySearch(
			{
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'people' },
					{ field: 'sys.versionStatus', equalTo: 'published' },
					{ field: 'euiEmail', equalTo: email }
				]
			},
			0,
			'euiWebsite'
		)

		if (!contensisUser || !contensisUser.length) return null

		return contensisUser[0]
	} catch (e) {
		console.error('Error while getting people entry:', e.data)
		if (e.status === 404) return null
		error(e.status, e.data)
	}
}

export default getPeopleEntryByEmail
