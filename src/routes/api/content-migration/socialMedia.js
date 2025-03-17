import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'

// Extract socials from personal data and create or update social media entries
export async function createOrUpdateSocialMediaEntries(personalData) {
	function addHttpIfMissing(link) {
		return link.startsWith('www.') || link.startsWith('http://') ? `https://${link}` : link
	}

	const newSocials = []
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
			console.log('possibleSocials[i].url', possibleSocials[i].url)

			// Skip if no url or if it doesn't start with http:// or https://
			const url = possibleSocials[i].url
			if (!url || (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('www.'))) continue

			const formattedLink = addHttpIfMissing(possibleSocials[i].url)

			console.log('formattedLink', formattedLink)

			// Check if social already exists
			const contensisSocials = await DeliveryClient.entries.search({
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'socialMedia' },
					{ field: 'sys.versionStatus', equalTo: 'published' },
					{ field: 'url', equalTo: formattedLink }
				]
			})

			// Update existing social media entry
			if (contensisSocials.items.length) {
				const existingSocial = contensisSocials.items[0]

				try {
					const updatedSocial = await ManagementClient.entries.patch(existingSocial.sys.id, {
						url: formattedLink,
						type: possibleSocials[i].type
					})

					newSocials.push(updatedSocial)

					await ManagementClient.entries.publish(updatedSocial)
					console.log(`Updated social media entry: ${formattedLink}`)
				} catch (error) {
					console.error(`Error updating social media entry: ${formattedLink}`, error)
				}
			}
			// Create new social media entry
			else {
				try {
					const createdSocial = await ManagementClient.entries.create({
						type: possibleSocials[i].type,
						url: formattedLink,
						sys: {
							contentTypeId: 'socialMedia',
							language: 'en-GB',
							dataFormat: 'entry'
						}
					})

					newSocials.push(createdSocial)

					await ManagementClient.entries.publish(createdSocial)
					console.log(`Created new social media entry: ${formattedLink}`)
				} catch (error) {
					console.error(`Error creating social media entry: ${formattedLink}`, error)
				}
			}
		}

		return newSocials
	} catch (e) {
		console.error('Error while creating or updating social media entries:', e.data ?? e)
	}

	return newSocials
}
