import { redirect } from '@sveltejs/kit'

export async function load({ parent }) {
	const parentData = await parent()

	if (!parentData.personalWebsite) redirect(302, '/')

	console.log(parentData.personalWebsite.people)
	const uniqueIdentityCode = parentData.personalWebsite.people.uniqueIdentityCode
	console.log('uniqueIdentityCode', uniqueIdentityCode)
	const response = await fetch(`https://intranet.eui.eu/api/cadmus?action=getCadmusXMLResponse&author=${uniqueIdentityCode}&limit=10`)
	const publications = await response.json()

	//clean the output data removing wrapping array to each field
	// {
	// 	authors: [ [Array] ],
	// 	editors: [ [] ],
	// 	others: [ [] ],
	// 	date: [ [Array] ],
	// 	title: [ [Array] ],
	// 	type: [ [Array] ],
	// 	uri: [ [Array] ]
	//   },

	const cleanPublications = publications.map((pub) => {
		const cleanPub = {}
		Object.keys(pub).forEach((key) => {
			cleanPub[key] = pub[key][0]
		})
		return cleanPub
	})
	console.log('cleanPublications', cleanPublications)
	return {
		publications: cleanPublications,
		uniqueIdentityCode
	}
}
