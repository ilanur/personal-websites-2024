import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()
	const pages = parentData.personalWebsite.pages
	const page = pages.find((page) => page.pageSlug === 'publications')

	if (!page) redirect(301, '/')

	return {
		page
	}
}
