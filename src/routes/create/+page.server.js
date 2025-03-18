import slugify from 'slugify'
import formatZodError from '$lib/utils/format-zod-error.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { ManagementClient, DeliveryClient } from '$lib/utils/contensis/_clients'
import { fileToFileBuffer, getPeopleEntryByEmail, uploadAsset } from '$lib/utils/contensis/server'
import { parseHtml } from '@contensis/html-canvas'
import { pwFormSchema } from '$lib/zod-schemas/personal-website-form.js'

export async function load({ locals, fetch }) {
	// Check if has session
	const session = await locals.auth()

	if (!session) redirect(302, '/auth/login')

	// Check if user exists in the people collection in Contensis
	const contensisUser = await getPeopleEntryByEmail(session.user.email) // --> Enable this line to use real user

	if (!contensisUser) redirect(302, '/')

	// Check if the user already has a personal website
	const results = await DeliveryClient.entries.search(
		{
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'websiteSlug', equalTo: contensisUser.sys.slug }
			]
		},
		1
	)

	const personalWebsite = results.items.length ? results.items[0] : null

	if (personalWebsite) redirect(302, `/${personalWebsite.websiteSlug}`)

	async function fetchNationalities() {
		try {
			const res = await fetch('/api/nationalities')
			const data = await res.json()

			if (data.nationalities) return data.nationalities
		} catch (err) {
			console.error('Error fetching nationalities:', err)
		}
	}

	return {
		contensisUser,
		nationalities: await fetchNationalities()
	}
}

export const actions = {
	default: async ({ request, locals }) => {
		try {
			const authUser = await locals.auth()
			const formData = Object.fromEntries(await request.formData())
			const formValidation = pwFormSchema.safeParse(formData)

			if (!formValidation.success) {
				return fail(400, { success: false, formErrors: formatZodError(formValidation.error) })
			}

			// Get contensis user from the People collection in the euiWebsite project.
			const contensisUser = await getPeopleEntryByEmail(authUser.user.email)

			let uploadedPhoto = null
			let createdPersonalWebsite = null

			if (formData.photoUpload.size !== 0 && formData.useEuiPhoto !== 'true') {
				const { fileBuffer, filename } = await fileToFileBuffer(formData.photoUpload)

				try {
					uploadedPhoto = await uploadAsset(fileBuffer, filename, {
						description: 'Photo uploaded from Personal website creation page',
						folderId: '/Content-Types-Assets/PersonalWebsites/Profiles',
						contentType: formData.photoUpload.type,
						title: contensisUser?.nameAndSurnameForTheWeb ?? formData.title
					})
				} catch (e) {
					console.error('Error uploading photo: ', e)
					return fail(500, {
						error: 'Error uploading photo'
					})
				}
			}

			const personalWebsitePayload = {
				title: contensisUser?.nameAndSurnameForTheWeb ?? formData.title,
				description: contensisUser?.aboutMe ?? '',
				websiteSlug: formData.slug,
				usePeopleProfilePicture: formData.useEuiPhoto === 'true',
				city: formData.city,
				lat: formData.lat,
				lng: formData.lng,
				isPublished: false,
				nationality: {
					nationality: [formData.nationality]
				},
				people: {
					sys: {
						id: contensisUser.sys.id,
						contentTypeId: 'people'
					}
				},
				sys: {
					contentTypeId: 'personalWebsites',
					language: 'en-GB',
					dataFormat: 'entry'
				}
			}

			if (uploadedPhoto) {
				personalWebsitePayload['image'] = {
					altText: `Profile picture of ${contensisUser?.nameAndSurnameForTheWeb}`,
					asset: {
						sys: {
							id: uploadedPhoto.sys.id,
							language: 'en-GB',
							dataFormat: 'asset'
						}
					}
				}
			}

			// Create personal website
			try {
				createdPersonalWebsite = await ManagementClient.entries.create(personalWebsitePayload)
				await ManagementClient.entries.invokeWorkflow(createdPersonalWebsite, 'draft.publish')
			} catch (e) {
				console.error('Error while creating personal website: ', e)
				error(e.status, 'Failed to create personal website')
			}

			if (!createdPersonalWebsite) return error(500, 'Failed to create personal website')

			// Create pages
			try {
				const pagesToCreate = ['Home']

				for (let i = 0, ilen = pagesToCreate.length; i < ilen; i++) {
					const createdPage = await ManagementClient.entries.create({
						title: pagesToCreate[i],
						pageSlug: slugify(pagesToCreate[i], { lower: true }),
						canvas: await parseHtml(''),
						personalWebsite: {
							sys: {
								id: createdPersonalWebsite.sys.id,
								contentTypeId: 'personalWebsites'
							}
						},
						sys: {
							contentTypeId: 'personalWebsitePage',
							language: 'en-GB',
							dataFormat: 'entry'
						}
					})

					await ManagementClient.entries.invokeWorkflow(createdPage, 'draft.publish')
				}
			} catch (e) {
				console.error('Error while creating pages: ', JSON.stringify(e))
				error(e.status, 'Error while creating pages')
			}

			return { createdPersonalWebsite }
		} catch (e) {
			console.error('Error while creating personal website:', e)
			return fail(e.status, {
				error: 'Something went wrong while creating the personal website'
			})
		}
	}
}
