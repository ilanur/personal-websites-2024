import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients'
import getPeopleEntryByEmail from '$lib/utils/contensis/getPeopleEntryByEmail.js'
import { uploadAsset } from '$lib/utils/contensis'
import { Query, Op, OrderBy } from 'contensis-delivery-api'

// Utility function to import assets (images or CVs)
async function importAsset(url, title, description, folder) {
	try {
		// Download the asset
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to download asset: ${response.statusText}`)
		}
		const arrayBuffer = await response.arrayBuffer()
		const fileBuffer = Buffer.from(arrayBuffer)
		const filename = url.split('/').pop()

		// Upload to Contensis
		const asset = await uploadAsset(fileBuffer, filename, {
			description: description,
			folderId: folder,
			contentType: response.headers.get('content-type'),
			title: title
		})
		return asset
	} catch (err) {
		console.error('Error downloading or uploading asset:', err)
		return null
	}
}

// Function to delete all entries by content type
async function deleteAllEntriesByContentType(contentType) {
	try {
		// const query = new Query(
		// 	Op.equalTo('sys.contentTypeId', contentType),
		// 	Op.equalTo('sys.versionStatus', 'published')
		// )
		// //query.orderBy = OrderBy.desc('publishingDate')
		// query.pageSize = 999
		// //query.pageIndex = 0

		const entriesToBeDeletedSearch = await DeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: contentType },
				{ field: 'sys.versionStatus', equalTo: 'published' }
			],
			pageSize: 999
		})
		const entriesToBeDeleted = entriesToBeDeletedSearch.items
		console.log('entriesToBeDeleted: ', entriesToBeDeleted)

		let progress = 0

		for (let i = 0, ilen = entriesToBeDeleted.length; i < ilen; i++) {
			const entry = entriesToBeDeleted[i]
			await ManagementClient.entries.delete(entry.sys.id, ['en-GB'], true)
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
		const clearEntries = clearEntriesParam === 'true'
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites?1')
		let progress = 0

		// Delete entries so we have a clean slate.
		if (clearEntries) {
			await deleteAllEntriesByContentType('personalWebsites')
			await deleteAllEntriesByContentType('personalWebsitePage')
			await deleteAllEntriesByContentType('personalWebsitesBlogPost')
			console.log('entries deleted')
		}

		// Loop over data and create items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			const personalData = oldCMSData[i]
			const createdPages = []

			// Stop after 10 entries for testing purposes
			if (i > 10) break

			// Create personalWebsite in Contensis and link created pages.
			const personalDataEmail = personalData.user.user_email?.toLowerCase()
			let contensisPeopleEntry

			if (personalDataEmail) {
				contensisPeopleEntry = await getPeopleEntryByEmail(personalDataEmail)
			}
			if (!contensisPeopleEntry) {
				console.log(`No people entry found for email: ${personalDataEmail}`)
				continue
			}
			console.log('contensisPeopleEntry: ', contensisPeopleEntry.entryTitle)

			// Import main image
			let mainImage = null
			if (personalData.user.user_picture && personalData.user.user_picture.length > 0) {
				mainImage = await importAsset(
					personalData.user.user_picture,
					personalData.title.rendered,
					`Image for ${personalData.title.rendered}`,
					'/Content-Types-Assets/PersonalWebsites'
				)
			}

			// Import CV if available on personaData.user.cv
			let cvAsset = null
			const cvUrl = personalData.user.cv
			if (cvUrl) {
				// We found a PDF link, let's download and upload the CV
				cvAsset = await importAsset(
					cvUrl,
					`${personalData.title.rendered} CV`,
					`CV for ${personalData.title.rendered}`,
					'/Content-Types-Assets/PersonalWebsites/CVs'
				)
			}

			// Prepare payload for personalWebsite entry
			const payload = {
				title: personalData.title.rendered,
				description: personalData.description,
				websiteSlug: personalData.user.personal_site?.split('/').pop() || '',
				city: personalData.user.city || '',
				lat: personalData.user.nationality_lat || '',
				lng: personalData.user.nationality_lng || '',
				nationality: {
					nationality: [personalData.user.nationality_name]
				},
				people: {
					sys: {
						id: contensisPeopleEntry.sys.id,
						contentTypeId: 'people'
					}
				},
				sys: {
					contentTypeId: 'personalWebsites',
					language: 'en-GB',
					dataFormat: 'entry'
				}
			}

			if (mainImage) {
				payload['image'] = {
					altText: personalData.title.rendered,
					asset: {
						sys: {
							id: mainImage.sys.id,
							language: 'en-GB',
							dataFormat: 'asset'
						}
					}
				}
			}

			if (cvAsset) {
				payload['cv'] = {
					sys: {
						id: cvAsset.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			}

			console.log('payload: ', payload)

			const createdPersonalWebsite = await ManagementClient.entries.create(payload)

			await ManagementClient.entries.invokeWorkflow(createdPersonalWebsite, 'draft.publish')

			progress += 1
			console.log(`${progress}/${ilen} "personalWebsite" entries created.`)

			// Define pages to exclude from migration.
			const pagesToExclude = ['Blog', 'Contact Me', 'Personal Website Settings']

			// Loop over pages
			for (let j = 0, jlen = personalData.pages.length; j < jlen; j++) {
				const page = personalData.pages[j]
				let title = page.title.rendered
				let pageSlug = ''

				if (pagesToExclude.includes(page.title.rendered)) continue

				if (page.title.rendered === 'Biography') {
					title = 'Home'
					pageSlug = 'home'
				}

				if (page.title.rendered === 'List of publications') {
					title = 'Publications'
					pageSlug = 'publications'
				}
				if (page.title.rendered === 'Research') {
					title = 'Research'
					pageSlug = 'research'
				}
				if (page.title.rendered === 'Publications in Cadmus') {
					title = 'Publications in Cadmus'
					pageSlug = 'publications-in-cadmus'
				}
				if (page.title.rendered === 'Work in progress') {
					title = 'Work in progress'
					pageSlug = 'work-in-progress'
				}

				const createdPage = await ManagementClient.entries.create({
					title,
					content: page.content.rendered,
					pageSlug: pageSlug,
					personalWebsite: {
						sys: {
							id: createdPersonalWebsite.sys.id,
							contentTypeId: 'personalWebsites'
						}
					},
					sys: {
						contentTypeId: 'personalWebsitePage',
						language: 'en-GB',
						dataFormat: 'entry'
					}
				})

				await ManagementClient.entries.invokeWorkflow(createdPage, 'draft.publish')

				createdPages.push(createdPage)
			}
		}

		return json({ success: true, data: oldCMSData }, { status: 200 })
	} catch (e) {
		console.error('Failed to migrate content to Contensis:', e)
		error(e.status, e.data)
	}
}
