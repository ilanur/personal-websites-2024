import { ManagementClient } from '$lib/utils/contensis/_clients'
import { parseHtml } from '@contensis/html-canvas'

// Create personal website pages
export async function createOrUpdatePages(personalWebsite, personalData) {
	// Define pages to exclude from migration.
	const pagesToExclude = ['Blog', 'Contact Me', 'Personal Website Settings', 'Publications in Cadmus']

	// Get existing pages
	const existingPages = personalWebsite.pages

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
		const payload = {
			title,
			canvas,
			pageSlug,
			personalWebsite: {
				sys: {
					id: personalWebsite.sys.id,
					contentTypeId: 'personalWebsites'
				}
			}
		}

		// Find existing page by slug
		let existingPage = existingPages.find((p) => p.pageSlug === pageSlug)

		// Update existing page
		if (existingPage) {
			try {
				existingPage = await ManagementClient.entries.patch(existingPage.sys.id, payload)
				console.log(`Updated page ${title} for website ${personalWebsite.title}`)
			} catch (e) {
				console.error(`Error updating page ${title}:`, e.data ?? e)
			}
		}
		// Create new page
		else {
			try {
				payload['sys'] = {
					contentTypeId: 'personalWebsitePage',
					language: 'en-GB',
					dataFormat: 'entry'
				}

				existingPage = await ManagementClient.entries.create(payload)
				console.log(`Created new page ${title} for website ${personalWebsite.title}`)
			} catch (e) {
				console.error(`Error creating page ${title}:`, e.data ?? e)
			}
		}

		await ManagementClient.entries.publish(existingPage)
	}
}
