import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { getPeopleEntryByEmail } from '$lib/utils/contensis/server'
import { createPwPages } from './createPwPages.js'
import { importAsset } from './importAsset.js'
import { getExistingPersonalWebsite } from './getExistingPersonalWebsite.js'
import { createPwBlogPosts } from './createPwBlogPosts.js'
import { createSocialMediaEntries } from './createSocialMediaEntries.js'

// Endpoint for testing purposes.
export const GET = async () => {
	const personalWebsites = await DeliveryClient.entries.search(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
				{ field: 'sys.versionStatus', equalTo: 'published' }
			]
		},
		2
	)

	const email = 'anatole.cheysson@eui.eu'
	const personalWebsite = personalWebsites.items.find((pw) => pw.people.email === email)

	return json({ success: true, personalWebsites: personalWebsites.items, personalWebsite }, { status: 200 })
}

export const POST = async () => {
	try {
		// Get old CMS data from Wordpress.
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites')
		let progress = 0

		// Test email - only process this specific website
		const TEST_EMAIL = 'adanela.musaraj@alumnifellows.eui.eu'

		// Loop over data and create/update items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			const personalData = oldCMSData[i]
			const personalDataEmail = personalData.user.user_email?.toLowerCase()

			if (!personalDataEmail) {
				console.log('Skipping entry without email')
				continue
			}

			// Skip all entries except the test email
			if (personalDataEmail !== TEST_EMAIL) {
				// console.log(`Skipping ${personalDataEmail} - only processing ${TEST_EMAIL} for testing`)
				continue
			}

			console.log(`Processing test email: ${TEST_EMAIL}`)

			// Check if personal website already exists
			let existingPersonalWebsite = await getExistingPersonalWebsite(personalData.user.personal_site)
			let contensisPeopleEntry = await getPeopleEntryByEmail(personalDataEmail)

			// Log the version of the existing personal website entry before fetching the latest version
			if (existingPersonalWebsite) {
				console.log('Existing version:', existingPersonalWebsite.sys)
				existingPersonalWebsite = await ManagementClient.entries.get({
					id: existingPersonalWebsite.sys.id,
					versionStatus: 'latest'
				})
				console.log('Fetched latest version:', existingPersonalWebsite.sys)
			}

			// Create a new people entry if it doesn't exist
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
				console.log(`${personalDataEmail} already exists. Skipping...`)
			}

			// Import main image if it has changed
			let mainImage = null

			if (personalData.user.user_picture && personalData.user.user_picture.length > 0) {
				const shouldImportImage =
					!existingPersonalWebsite?.image || existingPersonalWebsite.image.asset.sys.uri !== personalData.user.user_picture

				if (shouldImportImage) {
					mainImage = await importAsset(
						personalData.user.user_picture,
						personalData.title.rendered,
						`Image for ${personalData.title.rendered}`,
						'/Content-Types-Assets/PersonalWebsites'
					)
				}
			}

			// Import CV if available and changed
			let cvAsset = null
			const cvUrl = personalData.user.cv

			if (cvUrl) {
				const shouldImportCV = !existingPersonalWebsite?.cv || existingPersonalWebsite.cv.asset.sys.uri !== cvUrl

				console.log('Should import CV:', shouldImportCV)

				if (shouldImportCV) {
					cvAsset = await importAsset(
						cvUrl,
						`${personalData.title.rendered} CV`,
						`CV for ${personalData.title.rendered}`,
						'/Content-Types-Assets/PersonalWebsites/CVs'
					)
				}
			}

			const socialMediaEntries = await createSocialMediaEntries(personalData)

			// Prepare payload for personalWebsite entry
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
						id: contensisPeopleEntry.sys.id,
						contentTypeId: 'people'
					}
				},
				socialMedia: socialMediaEntries.map((social) => ({
					sys: {
						id: social.sys.id,
						contentTypeId: 'socialMedia'
					}
				}))
				// sys: {
				// 	contentTypeId: 'personalWebsites',
				// 	language: 'en-GB',
				// 	dataFormat: 'entry'
				// }
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
			} else if (existingPersonalWebsite?.image) {
				payload['image'] = existingPersonalWebsite.image
			}

			if (cvAsset) {
				payload['cv'] = {
					sys: {
						id: cvAsset.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			} else if (existingPersonalWebsite?.cv) {
				payload['cv'] = existingPersonalWebsite.cv
			}

			let newPersonalWebsite

			if (existingPersonalWebsite) {
				try {
					newPersonalWebsite = await ManagementClient.entries.patch(existingPersonalWebsite.sys.id, payload)
					await ManagementClient.entries.publish(newPersonalWebsite)
				} catch (e) {
					console.error('Error updating personal website:', e.data ?? e)
					progress += 1
					continue
				}
			} else {
				// Create new website
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

			// await ManagementClient.entries.invokeWorkflow(newPersonalWebsite, 'draft.publish')

			// try {
			// 	if (existingPersonalWebsite) {
			// 		// Update existing website
			// 		// payload.sys.id = existingPersonalWebsite.sys.id
			// 		newPersonalWebsite = await ManagementClient.entries.patch(existingPersonalWebsite.sys.id, payload)
			// 		console.log(`Updated personal website for ${personalDataEmail}`)
			// 	} else {
			// 		// Create new website
			// 		newPersonalWebsite = await ManagementClient.entries.create(payload)
			// 		console.log(`Created new personal website for ${personalDataEmail}`)
			// 	}

			// 	// await ManagementClient.entries.invokeWorkflow(newPersonalWebsite, 'draft.publish')
			// } catch (e) {
			// 	console.error('Error updating/creating personalWebsite entry:', e.data ?? e)
			// 	progress += 1
			// 	continue
			// }

			// Update/create pages
			await createPwPages(newPersonalWebsite, personalData)

			// Update/create blog posts
			await createPwBlogPosts(newPersonalWebsite, contensisPeopleEntry, personalData)

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
