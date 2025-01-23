import { DeliveryClient } from '$lib/utils/contensis/_clients.js'
import { json } from '@sveltejs/kit'

export const PUT = async ({ fetch }) => {
	let personalWebsites = []

	try {
		// Fetch personal websites
		try {
			const personalWebsitesRes = await DeliveryClient.entries.search({
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
					{ field: 'sys.versionStatus', equalTo: 'published' }
				],
				pageSize: 99999
			})

			personalWebsites = personalWebsitesRes.items
		} catch (e) {
			console.error('Error while getting personal websites:', e)
		}

		// Fetch blog posts for personal website and link them
		if (personalWebsites.length) {
			for (let i = 0, ilen = personalWebsites.length; i < ilen; i++) {
				let pw = personalWebsites[i]

				const blogposts = await DeliveryClient.entries.search({
					where: [
						{ field: 'sys.contentTypeId', equalTo: 'personalWebsitesBlogPost' },
						{ field: 'personalWebsite.sys.id', equalTo: pw.sys.id },
						{ field: 'sys.versionStatus', equalTo: 'published' }
					],
					pageSize: 99999
				})

				if (blogposts.items.length) {
					pw.blogPosts = blogposts.items.map((blogpost) => ({
						sys: {
							id: blogpost.sys.id,
							contentTypeId: 'personalWebsitesBlogPost'
						}
					}))

					await fetch('/api/contensis/entries/update', {
						method: 'PUT',
						body: JSON.stringify(pw)
					})
				}

				console.log(`${i + 1}/${personalWebsites.length} items updated.`)
			}
		}

		return json(
			{
				message: 'Success',
				personalWebsites
			},
			200
		)
	} catch (e) {
		console.error('Error while linking blog posts to personal websites:', e)
	}
}
