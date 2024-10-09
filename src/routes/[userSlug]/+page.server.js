import { redirect } from '@sveltejs/kit'

export async function load({ params, parent }) {
	const parentData = await parent()
	const pages = parentData.personalWebsite.pages
	const aboutPage = pages.find((page) => page.sys.slug === 'about')

	if (!aboutPage) redirect(302, '/')

	redirect(302, `/${params.userSlug}/about`)
}
