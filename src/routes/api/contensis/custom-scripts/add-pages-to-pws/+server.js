import { DeliveryClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'

export const PUT = async ({ fetch }) => {
	try {
		const personalWebsites = await DeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
				{ field: 'sys.versionStatus', equalTo: 'published' }
			],
			pageSize: 99999
		})

		for (let i = 0, ilen = personalWebsites.items.length; i < ilen; i++) {
			let pw = personalWebsites.items[i]

			const pages = await DeliveryClient.entries.search({
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'personalWebsitePage' },
					{ field: 'personalWebsite.sys.id', equalTo: pw.sys.id },
					{ field: 'sys.versionStatus', equalTo: 'published' }
				]
			})

			pw.pages = pages.items.map((page) => ({
				sys: {
					id: page.sys.id,
					contentTypeId: 'personalWebsitePage'
				}
			}))

			await fetch('/api/contensis/entries/update', {
				method: 'PUT',
				body: JSON.stringify({
					entry: pw,
					updatedFields: ['pages']
				})
			})

			console.log(`${i + 1}/${personalWebsites.items.length} items updated.`)
		}

		return json(
			{
				message: 'Success'
			},
			200
		)
	} catch (e) {
		console.error(e)
		error(500, 'Error while updating entries.', e)
	}
}
