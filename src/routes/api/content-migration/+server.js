import { ofetch } from 'ofetch'
import { json, error } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients'
import { getPeopleEntryByEmail, getPersonalWebsiteByEmail, uploadAsset } from '$lib/utils/contensis'
import { parseHtml } from '@contensis/html-canvas'

function truncateContent(content, wordLimit) {
	const plainText = content.replace(/<\/?[^>]+(>|$)/g, '')
	const words = plainText.split(/\s+/)
	const truncated = words.slice(0, wordLimit).join(' ')
	return words.length > wordLimit ? `${truncated}...` : truncated
}

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
			description,
			folderId: folder,
			contentType: response.headers.get('content-type'),
			title
		})

		return asset
	} catch (err) {
		console.error('Error downloading or uploading asset:', err)
		return null
	}
}

// Create personal website pages
async function createPwPages(createdPersonalWebsite, personalData) {
	// Define pages to exclude from migration.
	const pagesToExclude = [
		'Blog',
		'Contact Me',
		'Personal Website Settings',
		'Publications in Cadmus'
	]

	// Loop over pages
	for (let i = 0, ilen = personalData.pages.length; i < ilen; i++) {
		const page = personalData.pages[i]
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

		const canvas = await parseHtml(page.content.rendered)
		const createdPage = await ManagementClient.entries.create({
			title,
			canvas,
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
	}
}

// Create personal website blog posts
async function createPwBlogPosts(createdPersonalWebsite, contensisPeopleEntry, personalData) {
	const wpBlogPosts = personalData.posts

	for (let i = 0, ilen = wpBlogPosts.length; i < ilen; i++) {
		const wpBlogPost = wpBlogPosts[i]
		const canvas = await parseHtml(wpBlogPost.post_content)
		let blogpostImg

		if (wpBlogPost.thumbnail_url) {
			blogpostImg = await importAsset(
				wpBlogPost.thumbnail_url,
				wpBlogPost.post_title,
				`Image for ${wpBlogPost.post_title}`,
				'/Content-Types-Assets/PersonalWebsites/Blogs'
			)
		}

		const payload = {
			wpId: wpBlogPost.ID,
			title: wpBlogPost.post_title.replace(/&amp;/g, '&'),
			description: truncateContent(wpBlogPost.post_content, 30),
			canvas,
			publishingDate: wpBlogPost.post_date,
			personalWebsite: {
				sys: {
					id: createdPersonalWebsite.sys.id,
					contentTypeId: 'personalWebsites'
				}
			},
			authors: [
				{
					sys: {
						id: contensisPeopleEntry.sys.id,
						contentTypeId: 'people'
					}
				}
			],
			sys: {
				contentTypeId: 'personalWebsitesBlogPost',
				slug: wpBlogPost.post_name,
				language: 'en-GB',
				dataFormat: 'entry'
			}
		}

		if (blogpostImg) {
			payload['mainImage'] = {
				altText: wpBlogPost.post_title,
				asset: {
					sys: {
						id: blogpostImg.sys.id,
						language: 'en-GB',
						dataFormat: 'asset'
					}
				}
			}
		}

		try {
			const createdPwBlogPost = await ManagementClient.entries.create(payload)
			await ManagementClient.entries.invokeWorkflow(createdPwBlogPost, 'draft.publish')
		} catch (e) {
			console.error(`Error creating blog post (${wpBlogPost.post_name}): ${JSON.stringify(e.data)}`)
			continue
		}
	}
}

// Extract socials from personal data and create social media entries
async function createSocialMediaEntries(personalData) {
	function addHttpIfMissing(link) {
		return !link.startsWith('http://') && !link.startsWith('https://') ? `https://${link}` : link
	}

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
			type: 'Linkedin',
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
		for (let i = 0, ilen = possibleSocials.length; i < ilen; i++) {
			if (!possibleSocials[i].url) continue

			const formattedLink = addHttpIfMissing(possibleSocials[i].url)

			// Check if social already exists
			const contensisSocials = await DeliveryClient.entries.search({
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'socialMedia' },
					{ field: 'sys.versionStatus', equalTo: 'published' },
					{ field: 'url', equalTo: formattedLink }
				]
			})

			// If social exists, skip it.
			if (contensisSocials.items.length) {
				console.log('skip social creation', formattedLink)
				createdSocials.push(contensisSocials.items[0])
				continue
			}

			const createdSocial = await ManagementClient.entries.create({
				type: possibleSocials[i].type,
				url: formattedLink,
				sys: {
					contentTypeId: 'socialMedia',
					language: 'en-GB',
					dataFormat: 'entry'
				}
			})

			createdSocials.push(createdSocial)
			await ManagementClient.entries.invokeWorkflow(createdSocial, 'draft.publish')
		}

		return createdSocials
	} catch (e) {
		console.error('Error creating social media entries:', JSON.stringify(e.data))
	}

	return []
}

// Function to delete all entries by content type
async function deleteAllEntriesByContentType(contentType, filePath) {
	try {
		const query = {
			where: [{ field: filePath ? 'sys.dataFormat' : 'sys.contentTypeId', equalTo: contentType }],
			pageSize: 99999
		}

		if (filePath) {
			query['where'].push({ field: 'sys.properties.filePath', equalTo: filePath })
		}

		if (!filePath) {
			query['where'].push({ field: 'sys.versionStatus', equalTo: 'published' })
		}

		const entriesToBeDeletedSearch = await DeliveryClient.entries.search(query)
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

export const DELETE = async ({ url }) => {
	try {
		const collectionTypeToDelete = url.searchParams.get('deleteAllEntriesOfType')
		const filePath = url.searchParams.get('filePath')

		// Delete entries with specific content type.
		if (collectionTypeToDelete) {
			await deleteAllEntriesByContentType(collectionTypeToDelete, filePath)
		}

		return json({ success: true }, { status: 200 })
	} catch (e) {
		error(e.status, e.data)
	}
}

// Endpoint for testing purposes.
export const GET = async () => {
	return json({ success: true }, { status: 200 })
}

export const POST = async ({ url }) => {
	try {
		// Get old CMS data from Wordpress.
		const clearEntriesParam = url.searchParams.get('clearEntries')
		const clearEntries = clearEntriesParam === 'true'
		const oldCMSData = await ofetch('https://me.eui.eu/wp-json/eui/v1/sites')
		let progress = 0

		// Delete entries so we have a clean slate.
		if (clearEntries) {
			await deleteAllEntriesByContentType('personalWebsites')
			await deleteAllEntriesByContentType('personalWebsitePage')
			await deleteAllEntriesByContentType('personalWebsitesBlogPost')
			await deleteAllEntriesByContentType('asset', '/Content-Types-Assets/PersonalWebsites/')
			await deleteAllEntriesByContentType('asset', '/Content-Types-Assets/PersonalWebsites/Blogs/')
			await deleteAllEntriesByContentType('asset', '/Content-Types-Assets/PersonalWebsites/CVs/')
			await deleteAllEntriesByContentType('asset', '/Content-Types-Assets/PersonalWebsites/Pages/')
		}

		// Loop over data and create items in Contensis.
		for (let i = 0, ilen = oldCMSData.length; i < ilen; i++) {
			const personalData = oldCMSData[i]

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
				console.log(`${personalDataEmail} already exists in people entries. Skip creation...`)
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

			const socialMediaEntries = await createSocialMediaEntries(personalData)

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
				socialMedia: socialMediaEntries.map((social) => ({
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

			// Create pages
			await createPwPages(createdPersonalWebsite, personalData)

			// Create blog posts
			await createPwBlogPosts(createdPersonalWebsite, contensisPeopleEntry, personalData)

			// Log progress
			progress += 1
			console.log(`${progress}/${ilen} "personalWebsite" entries created.`)
		}

		console.log('Migration complete!')

		return json({ success: true, data: oldCMSData }, { status: 200 })
	} catch (e) {
		console.error('Failed to migrate content to Contensis:', e)
		error(e.status, e.data)
	}
}
