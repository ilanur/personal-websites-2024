import slugify from 'slugify'
import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import createContensisEntry from '../../../lib/utils/contensis/createContensisEntry'
import listEntriesByContentType from '../../../lib/utils/contensis/listEntriesByContentType'
import deleteContensisEntry from '../../../lib/utils/contensis/deleteContensisEntry'
import authenticateContensis from '$lib/utils/contensis/authenticateContensis'

async function delteContensisEntriesByContentType(contentType) {
	try {
		const authData = await authenticateContensis()
		const entriesToBeDeleted = await listEntriesByContentType(contentType)
		let progress = 0

		for (let i = 0, ilen = entriesToBeDeleted.length; i < ilen; i++) {
			const entry = entriesToBeDeleted[i]
			await deleteContensisEntry(entry.sys.id, true, authData)
			progress += 1
			console.log(`${progress}/${ilen} "${contentType}" entries deleted.`)
		}

		return json({ success: true }, { status: 200 })
	} catch (e) {
		error(e.status, e.data)
	}
}

export const DELETE = async ({ url }) => {
	try {
		const collectionTypeToDelete = url.searchParams.get('deleteAllEntriesOfType')

		// Delete entries with specific content type.
		if (collectionTypeToDelete) {
			await delteContensisEntriesByContentType(collectionTypeToDelete)
		}

		return json({ success: true }, { status: 200 })
	} catch (e) {
		error(e.status, e.data)
	}
}

export const POST = async () => {
	try {
		// Get old CMS data from Wordpress.
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites')
		let progress = 0

		// Delete entries so we have a clean slate.
		await delteContensisEntriesByContentType('personalWebsite')
		await delteContensisEntriesByContentType('pages')

		// Get auth data so it doesn't have to be fetched every loop.
		const authData = await authenticateContensis()

		// Loop over data and create items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			const personalData = oldCMSData[i]
			const createdPages = []

			// Loop over pages
			for (let j = 0, jlen = personalData.pages.length; j < jlen; j++) {
				const page = personalData.pages[j]
				let title = page.title.rendered

				if (title === 'Blog' || title === 'Contact Me' || title === 'Personal Website Settings') {
					continue
				}

				if (page.title.rendered === 'Biography') {
					title = 'About'
				}

				if (page.title.rendered === 'List of publications') {
					title = 'Publications'
				}

				const createdPage = await createContensisEntry(
					{
						title,
						content: page.content.rendered,
						pageTemplate: slugify(title, { lower: true }),
						sys: {
							contentTypeId: 'pages',
							language: 'en',
							dataFormat: 'entry'
						}
					},
					authData
				)

				createdPages.push(createdPage)
			}

			// Create personalWebsite in Contensis.
			await createContensisEntry(
				{
					title: personalData.title.rendered,
					description: personalData.description,
					socials: [
						{ type: 'facebook', value: personalData.facebook },
						{ type: 'googleScholar', value: personalData.google_scholar },
						{ type: 'researchGate', value: personalData.research_gate },
						{ type: 'linkedIn', value: personalData.linked_in },
						{ type: 'x', value: personalData.twitter },
						{ type: 'instagram', value: personalData.instagram },
						{ type: 'pinterest', value: personalData.pinterest },
						{ type: 'skype', value: personalData.skype },
						{ type: 'academia', value: personalData.academia },
						{ type: 'orcidID', value: '' },
						{ type: 'youtube', value: '' },
						{ type: 'github', value: '' }
					],
					pages: createdPages.map((page) => ({
						sys: {
							id: page.sys.id,
							contentTypeId: 'pages'
						}
					})),
					sys: {
						contentTypeId: 'personalWebsite',
						language: 'en',
						dataFormat: 'entry'
					}
				},
				authData
			)

			progress += 1
			console.log(`${progress}/${ilen} "personalWebsite" entries created.`)
		}

		return json({ success: true, data: oldCMSData }, { status: 200 })
	} catch (e) {
		console.error('Failed to migrate content to Contensis:', e)
		error(e.status, e.data)
	}
}
