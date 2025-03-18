import formatZodError from '$lib/utils/format-zod-error.js'
import { fileToFileBuffer, getPersonalWebsiteByEmail, uploadAsset } from '$lib/utils/contensis/server.js'
import { pwFormSchema } from '$lib/zod-schemas/personal-website-form.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients.js'
import { admins } from '$lib/utils/permissions'

export async function load({ parent, fetch }) {
	const parentData = await parent()

	if (!parentData.currentUserPersonalWebsite || !parentData.personalWebsite) throw redirect(301, '/')

	async function fetchNationalities() {
		try {
			const res = await fetch('/api/nationalities')
			const data = await res.json()

			if (data.nationalities) return data.nationalities
		} catch (err) {
			console.error('Error fetching nationalities:', err)
		}
	}

	const pageData = {
		user: parentData.personalWebsite.people,
		personalWebsite: parentData.personalWebsite,
		nationalities: await fetchNationalities()
	}

	if (parentData.authUser?.role === 'admin') return pageData
	if (parentData.authUser.email != parentData.personalWebsite.people.euiEmail) redirect(301, '/')

	return pageData
}

export const actions = {
	default: async ({ request, locals, fetch, cookies }) => {
		const authUser = await locals.auth()
		const formData = Object.fromEntries(await request.formData())
		const formValidation = pwFormSchema.safeParse(formData)
		const userIsAdmin = admins.includes(authUser?.user.email)

		if (!formValidation.success) {
			return fail(400, { success: false, formErrors: formatZodError(formValidation.error) })
		}

		try {
			// Use title, websiteURL, slug and email from personalWebsite for security reasons.
			let personalWebsite = await getPersonalWebsiteByEmail(userIsAdmin ? formData.email : authUser.user.email)

			if (personalWebsite) {
				// Delete existing image if the user hasn't uploaded one from the form.
				if (formData.useEuiPhoto !== 'true' && personalWebsite.image?.asset?.sys?.id) {
					try {
						await ManagementClient.entries.delete(personalWebsite.image.asset.sys.id)
					} catch (e) {
						console.error('Error while deleting existing photo:', e)
					}
				}

				// Upload image
				let uploadedPhoto = null

				if (formData.photoUpload.size !== 0 && formData.useEuiPhoto !== 'true') {
					const { fileBuffer, filename } = await fileToFileBuffer(formData.photoUpload)

					try {
						uploadedPhoto = await uploadAsset(fileBuffer, filename, {
							description: 'Photo uploaded from Personal website settings page',
							folderId: '/Content-Types-Assets/PersonalWebsites/Profiles',
							contentType: formData.photoUpload.type,
							title: personalWebsite.title
						})

						cookies.set('newImageUploaded', uploadedPhoto.sys.uri, { path: '/' })
					} catch (e) {
						console.error('Error uploading photo: ', e)
						return fail(500, {
							error: 'Error uploading photo'
						})
					}
				}

				// Fetch pages because unpublished pages are not shown on the personal website record.
				let personalWebsitePages = null

				try {
					personalWebsitePages = await DeliveryClient.entries.search({
						where: [
							{ field: 'sys.contentTypeId', equalTo: 'personalWebsitePage' },
							{ field: 'sys.versionStatus', equalTo: 'latest' },
							{ field: 'personalWebsite.sys.id', equalTo: personalWebsite.sys.id }
						]
					})
				} catch (e) {
					console.error('Error fetching pages:', e)
				}

				// PUBLISH/UNPUBLISH/CREATE pages
				if (personalWebsitePages?.items?.length) {
					try {
						for (const [key, value] of Object.entries(JSON.parse(formData.pagesToPublish))) {
							const pageEntry = personalWebsitePages.items.find((el) => el.pageSlug === key)

							// Enable/disable publications-in-cadmus page.
							if (key === 'publications-in-cadmus' && personalWebsite.enableCadmusPublications !== value) {
								personalWebsite.enableCadmusPublications = value
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
								console.log('CREATE PAGE', key)
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
				}

				// Delete old cv when changed cv is uploaded
				if (formData.cvChanged === 'true' && personalWebsite.cv?.sys?.id) {
					try {
						await ManagementClient.entries.delete(personalWebsite.cv.sys.id)
					} catch (e) {
						console.error('Error while deleting existing CV:', e)
					}
				}

				// Upload and link cv
				if (formData.cvUpload.size !== 0) {
					let uploadedCv = null

					try {
						const pdf = formData.cvUpload
						const pdfBuffer = Buffer.from(await pdf.arrayBuffer())

						// Upload CV
						uploadedCv = await uploadAsset(pdfBuffer, pdf.name, {
							description: `CV of ${formData.title}`,
							folderId: '/Content-Types-Assets/PersonalWebsites/CVs',
							contentType: 'application/pdf',
							title: `${personalWebsite.websiteSlug}-cv`
						})
					} catch (e) {
						console.log('Error uploading CV:', e)
					}

					if (uploadedCv) {
						personalWebsite['cv'] = {
							sys: {
								id: uploadedCv.sys.id,
								contentTypeId: 'asset',
								language: 'en-GB',
								dataFormat: 'asset'
							}
						}
					}
				}

				if (uploadedPhoto) {
					personalWebsite['image'] = {
						altText: `Avatar of ${personalWebsite.title}`,
						asset: {
							sys: {
								id: uploadedPhoto.sys.id,
								language: 'en-GB',
								dataFormat: 'asset'
							}
						}
					}
				}

				personalWebsite['nationality'] = { nationality: [formData.nationality] }
				personalWebsite['city'] = formData.city
				personalWebsite['lat'] = formData.lat
				personalWebsite['lng'] = formData.lng
				personalWebsite['usePeopleProfilePicture'] = formData.useEuiPhoto === 'true'
				personalWebsite['people'] = { sys: { id: personalWebsite.people.sys.id, contentType: 'people' } }
				personalWebsite['isPublished'] = formData.isPublished

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

			const updatedPersonalWebsiteResponse = await fetch('/api/contensis/entries/update', {
				method: 'PUT',
				body: JSON.stringify(personalWebsite)
			})

			const updatedPersonalWebsite = await updatedPersonalWebsiteResponse.json()

			return { success: true, updatedPersonalWebsite }
		} catch (e) {
			console.error('Error while updating personal website entry:', e.data)
			error(e.status, 'Error while updating personal website entry')
		}
	}
}
