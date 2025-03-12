import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'

// Extract socials from personal data and create social media entries
export async function createSocialMediaEntries(personalData) {
	function addHttpIfMissing(link) {
		return !link.startsWith('http://') && !link.startsWith('https://') ? `https://${link}` : link
	}

	const createdSocials = []
	const possibleSocials = [
		{
			type: 'Facebook',
			url: personalData.user.facebook
		},
		{
			type: 'Twitter',
			url: personalData.user.twitter
		},
		{
			type: 'Instagram',
			url: personalData.user.instagram
		},
		{
			type: 'Linkedin',
			url: personalData.user.linkedin
		},
		{
			type: 'ResearchGate',
			url: personalData.user.research_gate
		},
		{
			type: 'Academia.edu',
			url: personalData.user.academia
		}
	]

	try {
		for (let i = 0, ilen = possibleSocials.length; i < ilen; i++) {
			if (!possibleSocials[i].url) continue

			const formattedLink = addHttpIfMissing(possibleSocials[i].url)

			// Check if social already exists
			const contensisSocials = await DeliveryClient.entries.search({
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'socialMedia' },
					{ field: 'sys.versionStatus', equalTo: 'published' },
					{ field: 'url', equalTo: formattedLink }
				]
			})

			// If social exists, skip it.
			if (contensisSocials.items.length) {
				console.log('skip social creation', formattedLink)
				createdSocials.push(contensisSocials.items[0])
				continue
			}

			const createdSocial = await ManagementClient.entries.create({
				type: possibleSocials[i].type,
				url: formattedLink,
				sys: {
					contentTypeId: 'socialMedia',
					language: 'en-GB',
					dataFormat: 'entry'
				}
			})

			createdSocials.push(createdSocial)
			await ManagementClient.entries.invokeWorkflow(createdSocial, 'draft.publish')
		}

		return createdSocials
	} catch (e) {
		console.error('Error creating social media entries:', JSON.stringify(e.data))
	}

	return []
}
