import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients'
import { getPeopleEntryByEmail, uploadAsset } from '$lib/utils/contensis'

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
		const entriesToBeDeletedSearch = await DeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: contentType },
				{ field: 'sys.versionStatus', equalTo: 'published' }
			],
			pageSize: 999
		})

		const entriesToBeDeleted = entriesToBeDeletedSearch.items

		let progress = 0

		for (let i = 0, ilen = entriesToBeDeleted.length; i < ilen; i++) {
			const entry = entriesToBeDeleted[i]

			try {
				await ManagementClient.entries.delete(entry.sys.id, ['en-GB'], true)
			} catch (e) {
				console.error(`Error deleting entry ${entry.sys.id}: ${e.data.message}`)
				progress += 1
				continue
			}

			progress += 1
			console.log(`${progress}/${ilen} "${contentType}" entries deleted.`)
		}

		return json({ success: true }, { status: 200 })
	} catch (e) {
		error(e.status, e.data)
	}
}

export const GET = async ({ url }) => {
	const email = url.searchParams.get('email')
	const peopleEntry = await getPeopleEntryByEmail(email)

	const personalWebsite = await DeliveryClient.entries.search({
		where: [
			{ field: 'sys.contentTypeId', equalTo: 'people' },
			{ field: 'sys.versionStatus', equalTo: 'published' },
			{ field: 'sys.id', equalTo: 'cb85bda2-1874-4a4f-a392-d0c54c4f0a81' }
		]
	})

	const socials = await DeliveryClient.entries.search({
		where: [
			{ field: 'sys.contentTypeId', equalTo: 'socialMedia' },
			{ field: 'sys.versionStatus', equalTo: 'published' }
		]
	})

	return json({ success: true, data: personalWebsite, socials }, { status: 200 })
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
		}

		// Loop over data and create items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			const personalData = oldCMSData[i]
			const createdPages = []

			// Stop after 1 entry for testing purposes
			if (i === 1) break

			// Create personalWebsite in Contensis and link created pages.
			const personalDataEmail = personalData.user.user_email?.toLowerCase()
			let contensisPeopleEntry

			if (personalDataEmail) {
				contensisPeopleEntry = await getPeopleEntryByEmail(personalDataEmail)
			}

			// Create a new people entry
			if (!contensisPeopleEntry) {
				console.log(`${personalDataEmail} doesn't exist. Creating new people entry...`)

				try {
					const displayName = personalData.user.display_name
					contensisPeopleEntry = await ManagementClient.entries.create({
						nameAndSurnameForTheWeb: displayName,
						email: personalDataEmail,
						euiEmail: personalDataEmail,
						nameAndSurname: displayName,
						sys: {
							contentTypeId: 'people',
							language: 'en-GB',
							dataFormat: 'entry'
						}
					})

					await ManagementClient.entries.invokeWorkflow(contensisPeopleEntry, 'draft.publish')
					console.log(`${displayName} created in people entries. (${personalDataEmail})`)
				} catch (e) {
					console.error(`Error creating people entry: ${e.data}`)
					continue
				}
			} else {
				console.log('Person already exists in people entries. Skip creation...')
			}

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

			// Create socials
			const createdSocials = []
			const possibleSocials = [
				{
					type: 'Facebook',
					url: personalData.user.facebook
				},
				{
					type: 'Twitter',
					url: personalData.user.twitter
				},
				{
					type: 'Instagram',
					url: personalData.user.instagram
				},
				{
					type: 'LinkedIn',
					url: personalData.user.linkedin
				},
				{
					type: 'ResearchGate',
					url: personalData.user.research_gate
				},
				{
					type: 'Academia.edu',
					url: personalData.user.academia
				}
			]

			try {
				for (let j = 0, jlen = possibleSocials.length; j < jlen; j++) {
					if (!possibleSocials[j].url) continue

					// Check if social already exists
					const contensisSocials = await DeliveryClient.entries.search({
						where: [
							{ field: 'sys.contentTypeId', equalTo: 'socialMedia' },
							{ field: 'sys.versionStatus', equalTo: 'published' },
							{ field: 'url', equalTo: possibleSocials[j].url }
						]
					})

					// If social exists, skip it.
					if (contensisSocials.items.length) {
						console.log('skip social creation', possibleSocials[j].url)
						createdSocials.push(contensisSocials.items[0])
						continue
					}

					const createdSocial = await ManagementClient.entries.create({
						type: possibleSocials[j].type,
						url: possibleSocials[j].url,
						sys: {
							contentTypeId: 'socialMedia',
							language: 'en-GB',
							dataFormat: 'entry'
						}
					})

					createdSocials.push(createdSocial)
					await ManagementClient.entries.invokeWorkflow(createdSocial, 'draft.publish')
				}
			} catch (e) {
				console.error('Error creating social media entries:', e)
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
				socialMedia: createdSocials.map((social) => ({
					sys: {
						id: social.sys.id,
						contentTypeId: 'socialMedia'
					}
				})),
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

			let createdPersonalWebsite

			try {
				createdPersonalWebsite = await ManagementClient.entries.create(payload)
				await ManagementClient.entries.invokeWorkflow(createdPersonalWebsite, 'draft.publish')
			} catch (e) {
				console.error(`Error creating personalWebsite entry: ${JSON.stringify(e.data)}`)
				progress += 1
				continue
			}

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
