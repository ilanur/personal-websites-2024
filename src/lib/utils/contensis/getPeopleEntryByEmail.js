import deliverySearch from './deliverySearch'

async function getPeopleEntryByEmail(email) {
	const contensisUser = await deliverySearch(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'people' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'euiEmail', equalTo: email }
			]
		},
		'euiWebsite'
	)

	if (!contensisUser || !contensisUser.length) return null

	return contensisUser[0]
}

export default getPeopleEntryByEmail
