import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'
import { ofetch } from 'ofetch'

export const POST = async () => {
	try {
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites')

		const allPersonalWebsites = await DeliveryClient.entries.search(
			{
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
					{ field: 'sys.versionStatus', equalTo: 'published' }
				],
				pageSize: 999999
			},
			2
		)

		const hasNoPeopleEntry = []
		let progress = 0

		for (const cmsEntry of oldCMSData) {
			const personalWebsite = allPersonalWebsites.items.find((pw) => pw.websiteSlug === cmsEntry.user.personal_site?.split('/').pop())

			console.log('WIP', personalWebsite?.wpId)

			if (!personalWebsite || personalWebsite.wpId) {
				console.log('Skipping', personalWebsite?.entryTitle)
				progress++
				continue
			}

			if (!personalWebsite.people) {
				console.log('People entry not found. Skip.')
				hasNoPeopleEntry.push(personalWebsite.entryTitle)
				progress++
				continue
			}

			if (personalWebsite) {
				console.log('Updating personal website', personalWebsite.entryTitle)
				const updatedPw = await ManagementClient.entries.patch(personalWebsite.sys.id, {
					wpId: cmsEntry.id
				})

				await ManagementClient.entries.publish(updatedPw)
			} else {
				console.log('Personal website not found:', cmsEntry.user.display_name)
			}

			progress++
			console.log(`Progress: ${progress}/${oldCMSData.length}`)
		}

		return json(
			{
				success: true,
				data: {
					hasNoPeopleEntry
				}
			},
			{ status: 200 }
		)
	} catch (e) {
		console.error('Failed to fetch old CMS data', e.data ?? e)
		error(e.status, e.data)
	}
}
