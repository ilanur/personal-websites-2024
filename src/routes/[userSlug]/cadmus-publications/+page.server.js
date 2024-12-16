import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	const uniqueIdentityCode = parentData.personalWebsite.people.uniqueIdentityCode
	const response = await fetch(`https://intranet.eui.eu/api/cadmus?action=getCadmusXMLResponse&author=${uniqueIdentityCode}&limit=10`)
	const publications = await response.json()

	const cleanPublications = publications.map((pub) => {
		const cleanPub = {}

		Object.keys(pub).forEach((key) => {
			cleanPub[key] = pub[key][0]
		})

		return cleanPub
	})

	return {
		publications: cleanPublications,
		uniqueIdentityCode
	}
}
