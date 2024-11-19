import { redirect } from '@sveltejs/kit'

export async function load({ params, parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	const pages = parentData.personalWebsitePages
	console.log('pages', pages)
	const page = pages.find((page) => page.entryTitle === 'Home')

	return {
		page
	}
}
