import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { parseHtml } from '@contensis/html-canvas'

// Create personal website pages
export async function createPwPages(personalWebsite, personalData) {
	// Define pages to exclude from migration.
	const pagesToExclude = ['Blog', 'Contact Me', 'Personal Website Settings', 'Publications in Cadmus']

	// Get existing pages
	const existingPages = personalWebsite.pages.filter((page) => page.personalWebsite.sys.id === personalWebsite.sys.id)

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
			},
			sys: {
				contentTypeId: 'personalWebsitePage',
				language: 'en-GB',
				dataFormat: 'entry'
			}
		}

		try {
			// Find existing page by slug
			const existingPage = existingPages.items.find((p) => p.pageSlug === pageSlug)
			let updatedPage

			if (existingPage) {
				// Update existing page
				payload.sys.id = existingPage.sys.id
				updatedPage = await ManagementClient.entries.update(payload)
				console.log(`Updated page ${title} for website ${personalWebsite.title}`)
			} else {
				// Create new page
				updatedPage = await ManagementClient.entries.create(payload)
				console.log(`Created new page ${title} for website ${personalWebsite.title}`)
			}

			await ManagementClient.entries.invokeWorkflow(updatedPage, 'draft.publish')
		} catch (e) {
			console.error(`Error updating/creating page ${title}: ${JSON.stringify(e.data)}`)
			continue
		}
	}
}
