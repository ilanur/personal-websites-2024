import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	const pages = parentData.personalWebsite.pages
	const page = pages.find((page) => page.pageTemplate === 'teaching')

	if (!page) redirect((301, '/'))

	return {
		page
	}
}
