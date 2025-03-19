import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { getPeopleEntryByEmail } from '$lib/utils/contensis/server'
import { createOrUpdatePages } from './pages.js'
import { getExistingPersonalWebsite } from './getExistingPersonalWebsite.js'
import { createOrUpdateBlogPosts } from './blogPosts.js'
import { createOrUpdateSocialMediaEntries } from './socialMedia.js'
import { deleteAndReuploadMainImage } from './mainImage.js'
import { deleteAndReuploadCV } from './cv.js'
import { Op, Query } from 'contensis-delivery-api'

// Endpoint for testing purposes.
export const GET = async () => {
	const personalWebsites = await DeliveryClient.entries.search(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
				{ field: 'sys.versionStatus', equalTo: 'published' }
			],
			pageSize: 99999
		},
		2
	)

	const email = 'andrea.deangelis@alumni.eui.eu'
	const personalWebsite = personalWebsites.items.find((pw) => pw.people?.email === email)

	const assetsQuery = new Query(
		Op.equalTo('sys.dataFormat', 'asset'),
		// Op.equalTo('sys.id', '6ff7f726-8173-42cd-998a-8f0888ed21ca'),
		Op.or(
			Op.equalTo('sys.properties.filePath', '/Content-Types-Assets/PersonalWebsites/Profiles/'),
			Op.equalTo('sys.properties.filePath', '/Content-Types-Assets/PersonalWebsites/Blogs/'),
			Op.equalTo('sys.properties.filePath', '/Content-Types-Assets/PersonalWebsites/Cvs/'),
			Op.equalTo('sys.properties.filePath', '/Content-Types-Assets/PersonalWebsites/Pages/')
		)
	)

	assetsQuery.pageSize = 99999

	const assets = await DeliveryClient.entries.search(assetsQuery)

	const ids = []

	for (const asset of assets.items) {
		// ids.push(asset.sys)
		// if (asset.sys.properties.filename.includes('alternative-proteins-projections-to')) {
		ids.push(asset.sys.id)

		// ids.push({
		// 	id: asset.sys.id,
		// 	filename: asset.sys.properties.filename,
		// 	filePath: asset.sys.properties.filePath
		// })
	}

	return json(
		{
			success: true,
			ids,
			personalWebsite
		},
		{ status: 200 }
	)
}

export const POST = async () => {
	try {
		// Get old CMS data from Wordpress.
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites')
		let progress = 0

		// Test email - only process this specific website
		// const TEST_EMAIL = 'adanela.musaraj@alumnifellows.eui.eu'
		// const TEST_EMAIL = 'laura.bartolini@eui.eu'
		// const TEST_EMAIL = 'dieter.reinisch@eui.eu'
		// const TEST_EMAIL = 'andrea.deangelis@alumni.eui.eu'
		// const TEST_EMAIL = 'marco.cozzani@alumni.eui.eu'

		// Loop over data and create/update items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			// if (i > 9) break

			// ================================================
			// Get personal data
			// ================================================
			const personalData = oldCMSData[i]
			const personalDataEmail = personalData.user.user_email?.toLowerCase()

			if (!personalDataEmail) {
				progress += 1
				continue
			}

			// Skip all entries except the test email
			// if (personalDataEmail !== TEST_EMAIL) {
			// 	// console.log(`Skipping ${personalDataEmail} - only processing ${TEST_EMAIL} for testing`)
			// 	progress += 1
			// 	continue
			// }

			// ================================================
			// Check if personal website already exists
			// ================================================
			let personalWebsiteEntry = await getExistingPersonalWebsite(personalData.user.personal_site, 1)
			let existingPeopleEntry = await getPeopleEntryByEmail(personalDataEmail)

			console.log(`Personal website: ${personalWebsiteEntry?.entryTitle} (${personalWebsiteEntry?.sys?.id})`)
			console.log(`People entry: ${existingPeopleEntry?.entryTitle} (${existingPeopleEntry?.sys?.id})`)

			if (!existingPeopleEntry) {
				const address = personalDataEmail.split('@')[0]
				const domain = personalDataEmail.split('@').pop()

				// Check if people entry exists by @eui.eu domain.
				if (domain === 'alumni.eui.eu') {
					existingPeopleEntry = await getPeopleEntryByEmail(`${address}@eui.eu`)
					existingPeopleEntry = await ManagementClient.entries.patch(existingPeopleEntry.sys.id, {
						email: personalDataEmail,
						euiEmail: personalDataEmail
					})
				}
			}

			// ================================================
			// Create or update people entry
			// ================================================
			if (!existingPeopleEntry) {
				console.log(`${personalDataEmail} doesn't exist. Creating new people entry...`)

				try {
					const displayName = personalData.user.display_name
					existingPeopleEntry = await ManagementClient.entries.create({
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
				} catch (e) {
					console.error(`Error creating people entry: ${e.data}`)
					continue
				}
			} else {
				console.log(`${personalDataEmail} already exists, don't create new people entry...`)
			}

			await ManagementClient.entries.publish(existingPeopleEntry)

			// ================================================
			// Social media
			// ================================================
			const socialMediaEntries = await createOrUpdateSocialMediaEntries(personalData)

			// ================================================
			// Prepare payload for personalWebsite entry
			// ================================================
			const payload = {
				title: personalData.title.rendered,
				description: personalData.description,
				websiteSlug: personalData.user.personal_site?.split('/').pop() || '',
				wpId: personalData.id,
				city: personalData.user.city || '',
				lat: personalData.user.nationality_lat || '',
				lng: personalData.user.nationality_lng || '',
				nationality: {
					nationality: [personalData.user.nationality_name]
				},
				people: {
					sys: {
						id: existingPeopleEntry.sys.id,
						contentTypeId: 'people'
					}
				},
				socialMedia: socialMediaEntries.map((social) => ({
					sys: {
						id: social.sys.id,
						contentTypeId: 'socialMedia'
					}
				}))
			}

			// ================================================
			// Update or create personal website
			// ================================================

			// Update existing personalwebsite
			if (personalWebsiteEntry) {
				try {
					personalWebsiteEntry = await ManagementClient.entries.patch(personalWebsiteEntry.sys.id, payload)
					console.log('Updated existing personal website for', personalDataEmail)
				} catch (e) {
					console.error('Error updating personal website:', e.data ?? e)
					progress += 1
					continue
				}
			}
			// Create new personalwebsite
			else {
				try {
					payload['sys'] = {
						contentTypeId: 'personalWebsites',
						language: 'en-GB',
						dataFormat: 'entry'
					}

					personalWebsiteEntry = await ManagementClient.entries.create(payload)
					console.log('Created new personal website for', personalDataEmail)
				} catch (e) {
					console.error('Error creating personal website:', e.data ?? e)
					progress += 1
					continue
				}
			}

			await ManagementClient.entries.publish(personalWebsiteEntry)

			const latestPersonalWebsite = await DeliveryClient.entries.get({ id: personalWebsiteEntry.sys.id, linkDepth: 1 })
			const linkPayload = {}

			// ================================================
			// Main image
			// ================================================
			const mainImage = await deleteAndReuploadMainImage(latestPersonalWebsite, personalData)

			if (mainImage) {
				linkPayload['image'] = {
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

			// ================================================
			// CV
			// ================================================
			const cvAsset = await deleteAndReuploadCV(latestPersonalWebsite, personalData)

			if (cvAsset) {
				linkPayload['cv'] = {
					sys: {
						id: cvAsset.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			}

			// ================================================
			// Pages
			// ================================================
			const newPages = await createOrUpdatePages(latestPersonalWebsite, personalData)

			linkPayload.pages = newPages.map((page) => ({
				sys: {
					id: page?.sys?.id,
					contentTypeId: 'personalWebsitePage'
				}
			}))

			console.log(
				'New or updated pages:',
				newPages.map((page) => page.entryTitle)
			)

			// ================================================
			// Blog posts
			// ================================================
			const newBlogPosts = await createOrUpdateBlogPosts(latestPersonalWebsite, existingPeopleEntry, personalData)

			linkPayload.blogPosts = newBlogPosts.map((blogPost) => ({
				sys: {
					id: blogPost?.sys?.id,
					contentTypeId: 'personalWebsiteBlogPost'
				}
			}))

			// Update personal website with new link payload
			try {
				const updatedPersonalWebsite = await ManagementClient.entries.patch(latestPersonalWebsite.sys.id, linkPayload)
				await ManagementClient.entries.publish(updatedPersonalWebsite)
			} catch (e) {
				console.error('Failed to update and publish personal website:', e.data ?? e)
			}

			// Log progress
			progress += 1
			console.log(`${progress}/${ilen} "personalWebsite" entries processed (${personalDataEmail}).`)
		}

		console.log('Migration complete!')

		return json({ success: true, data: oldCMSData }, { status: 200 })
	} catch (e) {
		console.error('Failed to migrate content to Contensis:', e.data ?? e)
		error(e.status, e.data)
	}
}
