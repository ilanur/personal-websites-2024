import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { getPeopleEntryByEmail } from '$lib/utils/contensis/server'
import { createOrUpdatePages } from './pages.js'
import { getExistingPersonalWebsite } from './getExistingPersonalWebsite.js'
import { createOrUpdateBlogPosts } from './BlogPosts.js'
import { createOrUpdateSocialMediaEntries } from './socialMedia.js'
import { deleteAndReuploadMainImage } from './mainImage.js'
import { deleteAndReuploadCV } from './cv.js'

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

	return json(
		{
			success: true,
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
		const TEST_EMAIL = 'andrea.deangelis@alumni.eui.eu'

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
			if (personalDataEmail !== TEST_EMAIL) {
				// console.log(`Skipping ${personalDataEmail} - only processing ${TEST_EMAIL} for testing`)
				progress += 1
				continue
			}

			// ================================================
			// Check if personal website already exists
			// ================================================
			let existingPersonalWebsite = await getExistingPersonalWebsite(personalData.user.personal_site)
			let existingPeopleEntry = await getPeopleEntryByEmail(personalDataEmail)

			// ================================================
			// Create people entry if it doesn't exist
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

					await ManagementClient.entries.publish(existingPeopleEntry)
				} catch (e) {
					console.error(`Error creating people entry: ${e.data}`)
					continue
				}
			} else {
				console.log(`${personalDataEmail} already exists. Skipping...`)
			}

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
			// Main image
			// ================================================
			const mainImage = await deleteAndReuploadMainImage(existingPersonalWebsite, personalData)

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

			// ================================================
			// CV
			// ================================================
			const cvAsset = await deleteAndReuploadCV(existingPersonalWebsite, personalData)

			if (cvAsset) {
				payload['cv'] = {
					sys: {
						id: cvAsset.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			}

			// ================================================
			// Update or create personal website
			// ================================================
			let newPersonalWebsite

			// Update existing website
			if (existingPersonalWebsite) {
				try {
					newPersonalWebsite = await ManagementClient.entries.patch(existingPersonalWebsite.sys.id, payload)
					await ManagementClient.entries.publish(newPersonalWebsite)
				} catch (e) {
					console.error('Error updating personal website:', e.data ?? e)
					progress += 1
					continue
				}
			}
			// Create new website
			else {
				try {
					payload['sys'] = {
						contentTypeId: 'personalWebsites',
						language: 'en-GB',
						dataFormat: 'entry'
					}

					newPersonalWebsite = await ManagementClient.entries.create(payload)
					await ManagementClient.entries.publish(newPersonalWebsite)
					console.log(`Created new personal website for ${personalDataEmail}`)
				} catch (e) {
					console.error('Error creating personal website:', e.data ?? e)
					progress += 1
					continue
				}
			}

			// Fetch latest personal website with a bigger linkDepth in order to get all pages
			const latestPersonalWebsite = await DeliveryClient.entries.get({ id: newPersonalWebsite.sys.id, linkDepth: 1 })

			// Update/create pages
			await createOrUpdatePages(latestPersonalWebsite, personalData)

			// create/update blog posts
			await createOrUpdateBlogPosts(latestPersonalWebsite, existingPeopleEntry, personalData)

			// Log progress
			progress += 1
			console.log(`${progress}/${ilen} "personalWebsite" entries processed.`)
		}

		console.log('Migration complete!')

		return json({ success: true, data: oldCMSData }, { status: 200 })
	} catch (e) {
		console.error('Failed to migrate content to Contensis:', e.data ?? e)
		error(e.status, e.data)
	}
}
