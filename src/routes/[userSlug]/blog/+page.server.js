import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	return {
		blogPosts: parentData.personalWebsite.blogPosts
	}
}
