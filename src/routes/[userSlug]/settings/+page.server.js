import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()
	if (parentData.authUser.email != parentData.personalWebsite.people.euiEmail) {
		redirect(301, '/')
	}
	return {
		user: parentData.personalWebsite.people,
		personalWebsite: parentData.personalWebsite
	}
}
