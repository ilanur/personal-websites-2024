import formatZodError from '$lib/utils/format-zod-error.js'
import { getPersonalWebsiteByEmail } from '$lib/utils/contensis/server.js'
import { pwFormSchema } from '$lib/zod-schemas/personal-website-form.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients.js'
import { admins } from '$lib/utils/permissions'

export async function load({ parent }) {
	const parentData = await parent()

	const pageData = {
		user: parentData.personalWebsite.people,
		personalWebsite: parentData.personalWebsite
	}

	if (parentData.authUser?.role === 'admin') {
		return pageData
	}

	if (parentData.authUser.email != parentData.personalWebsite.people.euiEmail) {
		redirect(301, '/')
	}

	return pageData
}

export const actions = {
	default: async ({ request, locals, fetch }) => {
		const authUser = await locals.auth()
		const formData = Object.fromEntries(await request.formData())
		const formValidation = pwFormSchema.safeParse(formData)
		const userIsAdmin = admins.includes(authUser?.user.email)

		if (!formValidation.success) {
			return fail(400, { success: false, formErrors: formatZodError(formValidation.error) })
		}

		try {
			let personalWebsite = await getPersonalWebsiteByEmail(userIsAdmin ? formData.email : authUser.user.email)

			if (personalWebsite) {
				// Fetch pages because unpublished pages are not shown on the personal website record.
				const personalWebsitePages = await DeliveryClient.entries.search({
					where: [
						{ field: 'sys.contentTypeId', equalTo: 'personalWebsitePage' },
						{ field: 'sys.versionStatus', equalTo: 'latest' },
						{ field: 'personalWebsite.sys.id', equalTo: personalWebsite.sys.id }
					]
				})

				// PUBLISH/UNPUBLISH/CREATE PAGES
				try {
					for (const [key, value] of Object.entries(JSON.parse(formData.pagesToPublish))) {
						const pageEntry = personalWebsitePages.items.find((el) => el.pageSlug === key)

						// Enable/disable publications-in-cadmus page.
						if (key === 'publications-in-cadmus' && personalWebsite.enableCadmusPublications !== value) {
							personalWebsite.enableCadmusPublications = value

							continue
						}

						if (!pageEntry) {
							continue
						}

						// If page exists, and value === false; unpublish the page.
						if (pageEntry && pageEntry.sys.workflow.state === 'versionComplete' && !value) {
							await ManagementClient.entries.invokeWorkflow(pageEntry, 'versionComplete.sysUnpublish')
						}
						// If page exists, and value === true; publish the page.
						else if (pageEntry && pageEntry.sys.workflow.state === 'draft' && value) {
							await ManagementClient.entries.invokeWorkflow(pageEntry, 'draft.publish')
						}
						// If page doesn't exist, and value === true; create the page.
						else if (!pageEntry && value && key !== 'publications-in-cadmus') {
							const titleSpaced = key.replace(/-/g, ' ')
							const createdPage = await ManagementClient.entries.create({
								title: titleSpaced.charAt(0).toUpperCase() + titleSpaced.slice(1).toLowerCase(),
								canvas: null,
								pageSlug: key,
								personalWebsite: {
									sys: {
										id: personalWebsite.sys.id,
										contentType: 'personalWebsites'
									}
								},
								sys: {
									contentTypeId: 'personalWebsitePage',
									language: 'en-GB',
									dataFormat: 'entry'
								}
							})

							await ManagementClient.entries.invokeWorkflow(createdPage, 'draft.publish')

							// Link new page to existing personal website.
							const totalPages = [
								...personalWebsite.pages,
								{
									sys: { id: createdPage.sys.id, contentTypeId: 'personalWebsitePage' }
								}
							]

							personalWebsite.pages = totalPages
						}
					}
				} catch (e) {
					console.error('Error while publishing/unpublishing pages:', e.data)
				}

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

			await fetch('/api/contensis/entries/update', {
				method: 'PUT',
				body: JSON.stringify(personalWebsite)
			})

			return { success: true }
		} catch (e) {
			console.error('Error while updating personal website entry:', e.data)
			error(e.status, 'Error while updating personal website entry')
		}
	}
}
