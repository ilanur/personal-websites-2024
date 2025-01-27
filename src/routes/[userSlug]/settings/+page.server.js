import formatZodError from '$lib/utils/format-zod-error.js'
import { PUBLIC_EUI_WEB } from '$env/static/public'
import { fileToFileBuffer, getPersonalWebsiteByEmail, uploadAsset } from '$lib/utils/contensis/server.js'
import { pwFormSchema } from '$lib/zod-schemas/personal-website-form.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients.js'
import { admins } from '$lib/utils/permissions'

export async function load({ parent, fetch }) {
	const parentData = await parent()

	if (!parentData.currentUserPersonalWebsite) throw redirect(302, '/')

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
	default: async ({ request, locals, fetch }) => {
		const authUser = await locals.auth()
		const formData = Object.fromEntries(await request.formData())
		const formValidation = pwFormSchema.safeParse(formData)
		const userIsAdmin = admins.includes(authUser?.user.email)

		console.log('FORM DATA', formData)

		if (!formValidation.success) {
			return fail(400, { success: false, formErrors: formatZodError(formValidation.error) })
		}

		try {
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
							folderId: '/Content-Types-Assets/PersonalWebsites',
							contentType: formData.photoUpload.type,
							title: formData.slug
						})

						console.log('URL TO PURGE', `${PUBLIC_EUI_WEB}${uploadedPhoto.sys.uri}`)

						const liveClear = await fetch(
							`https://live-eui.cloud.contensis.com/NewGenerationSite/system/purge-cache-manually.aspx?url=${PUBLIC_EUI_WEB}${uploadedPhoto.sys.uri}`
						)

						const previewClear = await fetch(
							`https://preview-eui.cloud.contensis.com/NewGenerationSite/system/purge-cache-manually.aspx?url=${PUBLIC_EUI_WEB}${uploadedPhoto.sys.uri}`
						)

						console.log('UPLOADED PHOTO', uploadedPhoto)
						console.log('CACHE CLEAR RESPONSE', liveClear)
						console.log('CACHE CLEAR RESPONSE', previewClear)
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
							title: `${formData.slug}-cv`
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

			const updatedPersonalWebsiteResponse = await fetch('/api/contensis/entries/update', {
				method: 'PUT',
				body: JSON.stringify(personalWebsite)
			})

			const updatedPersonalWebsite = await updatedPersonalWebsiteResponse.json()

			// TODO: Check with Emanuele
			// PUBLISH/UNPUBLISH personal website
			// const pwSys = personalWebsite.sys
			// if (pwSys.versionStatus === 'published' && pwSys.workflow.state === 'versionComplete' && formData.pwPublishState === 'false') {
			// 	await ManagementClient.entries.invokeWorkflow(personalWebsite, 'versionComplete.sysUnpublish')
			// }

			return { success: true, updatedPersonalWebsite }
		} catch (e) {
			console.error('Error while updating personal website entry:', e.data)
			error(e.status, 'Error while updating personal website entry')
		}
	}
}
