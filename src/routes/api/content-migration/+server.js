import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { PwDeliveryClient, PwManagementClient } from '$lib/utils/contensis-clients.js'
import slugify from 'slugify'
import getPeopleEntryByEmail from '$lib/utils/contensis/getPeopleEntryByEmail.js'

async function deleteAllEntriesByContentType(contentType) {
	try {
		const entriesToBeDeleted = await PwDeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: contentType },
				{ field: 'sys.versionStatus', equalTo: 'published' }
			],
			pageSize: 999999
		})

		let progress = 0

		for (let i = 0, ilen = entriesToBeDeleted.length; i < ilen; i++) {
			const entry = entriesToBeDeleted[i]
			await PwManagementClient.entries.delete(entry.sys.id, ['en'], true)
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
			await deleteAllEntriesByContentType(collectionTypeToDelete)
		}

		return json({ success: true }, { status: 200 })
	} catch (e) {
		error(e.status, e.data)
	}
}

export const POST = async ({ url }) => {
	try {
		// Get old CMS data from Wordpress.
		const clearEntriesParam = url.searchParams.get('clearEntries')
		const clearEntries = !clearEntriesParam ? true : clearEntriesParam === 'true'
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites')
		let progress = 0

		// Delete entries so we have a clean slate.
		if (clearEntries) {
			await deleteAllEntriesByContentType('personalWebsite')
			await deleteAllEntriesByContentType('pages')
		}

		// Define pages to exclude from migration.
		const pagesToExclude = ['Blog', 'Contact Me', 'Personal Website Settings']

		// Loop over data and create items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			const personalData = oldCMSData[i]
			const createdPages = []

			// Loop over pages
			for (let j = 0, jlen = personalData.pages.length; j < jlen; j++) {
				const page = personalData.pages[j]
				let title = page.title.rendered

				if (pagesToExclude.includes(page.title.rendered)) continue

				if (page.title.rendered === 'Biography') {
					title = 'About'
				}

				if (page.title.rendered === 'List of publications') {
					title = 'Publications'
				}

				const createdPage = await PwManagementClient.entries.create({
					title,
					content: page.content.rendered,
					pageTemplate: slugify(title, { lower: true }),
					sys: {
						contentTypeId: 'pages',
						language: 'en',
						dataFormat: 'entry'
					}
				})

				await PwManagementClient.entries.invokeWorkflow(createdPage, 'draft.publish')

				createdPages.push(createdPage)
			}

			// Create personalWebsite in Contensis and link created pages.
			const personalDataEmail = personalData.user.user_email?.toLowerCase()
			let contensisPeopleEntry

			if (personalDataEmail) {
				contensisPeopleEntry = await getPeopleEntryByEmail(personalDataEmail)
			}

			const createdPersonalWebsite = await PwManagementClient.entries.create({
				title: personalData.title.rendered,
				description: personalData.description,
				email: personalDataEmail ?? '',
				websiteSlug: personalData.user.personal_site?.split('/').pop() || '',
				peopleEntryId: contensisPeopleEntry?.sys?.id ?? '',
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
			})

			await PwManagementClient.entries.invokeWorkflow(createdPersonalWebsite, 'draft.publish')

			progress += 1
			console.log(`${progress}/${ilen} "personalWebsite" entries created.`)
		}

		return json({ success: true, data: oldCMSData }, { status: 200 })
	} catch (e) {
		console.error('Failed to migrate content to Contensis:', e)
		error(e.status, e.data)
	}
}
