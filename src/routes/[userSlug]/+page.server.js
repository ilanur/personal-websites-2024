import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()
	const isPwOfAuthUser = parentData.authUser?.email === parentData.personalWebsite?.people.euiEmail

	if (!parentData.personalWebsite || (!parentData.personalWebsite?.isPublished && !isPwOfAuthUser)) redirect(301, '/')

	const pages = parentData.personalWebsitePages
	const page = pages.find((page) => page.pageSlug === 'home')

	return {
		page
	}
}
