import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	const pages = parentData.personalWebsitePages
	const page = pages.find((page) => page.pageSlug === 'work-in-progress')

	if (!page) redirect((301, '/'))

	return {
		page
	}
}
