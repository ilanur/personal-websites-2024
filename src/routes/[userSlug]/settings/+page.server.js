import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()
	console.log(parentData.personalWebsite.email)

	return {
		personalWebsite: parentData.personalWebsite
	}
}
