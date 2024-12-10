import formatZodError from '$lib/utils/format-zod-error.js'
import { getPersonalWebsiteByEmail } from '$lib/utils/contensis/server.js'
import { pwFormSchema } from '$lib/zod-schemas/personal-website-form.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { ManagementClient } from '$lib/utils/contensis/_clients.js'

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

export const actions = {
	default: async ({ request, locals }) => {
		const authUser = await locals.auth()
		const formData = Object.fromEntries(await request.formData())
		const formValidation = pwFormSchema.safeParse(formData)

		if (!formValidation.success) {
			return fail(400, { success: false, formErrors: formatZodError(formValidation.error) })
		}

		try {
			const personalWebsite = await getPersonalWebsiteByEmail(authUser.user.email)

			if (personalWebsite) {
				personalWebsite['websiteSlug'] = formData.slug
				personalWebsite['nationality'] = { nationality: [formData.nationality] }
				personalWebsite['city'] = formData.city
				personalWebsite['lat'] = formData.lat
				personalWebsite['lng'] = formData.lng
				personalWebsite['usePeopleProfilePicture'] = formData.useEuiPhoto === 'true'
				personalWebsite['people'] = { sys: { id: personalWebsite.people.sys.id, contentType: 'people' } }

				const possibleSocials = [
					'Facebook',
					'Twitter',
					'Instagram',
					'Linkedin',
					'Youtube',
					'Blog',
					'Flickr',
					'ResearchGate',
					'Academia.edu',
					'Bluesky'
				]

				const socialMediaEntries = []

				for (const social of possibleSocials) {
					const contensisSocial = personalWebsite.socialMedia.find((el) => el.type === social)

					// Create social if it doesn't exist
					if (formData[social] && !contensisSocial) {
						try {
							const createdSocial = await ManagementClient.entries.create({
								type: social,
								url: formData[social],
								sys: {
									contentTypeId: 'socialMedia',
									language: 'en-GB',
									dataFormat: 'entry'
								}
							})

							await ManagementClient.entries.invokeWorkflow(createdSocial, 'draft.publish')
							socialMediaEntries.push(createdSocial)
						} catch (e) {
							console.error('Error creating social: ', e)
						}
					}

					// Update social if it exists
					if (formData[social] && contensisSocial) {
						try {
							contensisSocial.entryTitle = formData[social]
							contensisSocial.url = formData[social]

							const updatedSocial = await ManagementClient.entries.update(contensisSocial)

							if (updatedSocial.sys.workflow.state === 'draft') {
								await ManagementClient.entries.invokeWorkflow(updatedSocial, 'draft.publish')
							}

							socialMediaEntries.push(updatedSocial)
						} catch (e) {
							console.error('Error updating social:', e)
						}
					}
				}

				personalWebsite['socialMedia'] = socialMediaEntries.map((el) => ({
					sys: {
						id: el.sys.id,
						contentTypeId: 'socialMedia'
					}
				}))
			}

			const updatedPersonalWebsite = await ManagementClient.entries.update(personalWebsite)

			if (updatedPersonalWebsite.sys.workflow.state === 'draft') {
				await ManagementClient.entries.invokeWorkflow(updatedPersonalWebsite, 'draft.publish')
			}

			return { success: true }
		} catch (e) {
			console.error('Error while updating personal website entry:', e.data)
			error(e.status, 'Error while updating personal website entry')
		}
	}
}
