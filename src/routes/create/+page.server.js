import { error, fail, redirect } from '@sveltejs/kit'
import { ManagementClient, DeliveryClient } from '$lib/utils/contensis/_clients'
import { getPeopleEntryByEmail } from '$lib/utils/contensis/server'
import slugify from 'slugify'

export async function load(event) {
	// Check if has session
	const session = await event.locals.auth()
	if (!session) redirect(302, '/')

	// Check if user exists in the people collection in Contensis
	// const contensisUser = await getPeopleEntryByEmail('emanuele.strano@eui.eu')
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

	// Get nationalities for creation page
	let nationalities = []

	try {
		nationalities = await ManagementClient.components.get('nationality')
	} catch (e) {
		console.error('Error while fetching nationalities: ', e)
	}

	return {
		contensisUser,
		nationalities: nationalities.fields[0].validations.allowedValues.values
	}
}

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = Object.fromEntries(await request.formData())

			// Get contensis user from the People collection in the euiWebsite project.
			const contensisUser = await getPeopleEntryByEmail(formData.email)

			let createdPersonalWebsite

			// Create personal website
			try {
				createdPersonalWebsite = await ManagementClient.entries.create({
					title: contensisUser?.nameAndSurnameForTheWeb ?? formData.title,
					description: contensisUser?.aboutMe ?? '',
					websiteSlug: formData.slug,
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
				})

				await ManagementClient.entries.invokeWorkflow(createdPersonalWebsite, 'draft.publish')
			} catch (e) {
				console.error('Error while creating personal website: ', e)
				error(e.status, 'Failed to create personal website')
			}

			if (!createdPersonalWebsite) return error(500, 'Failed to create personal website')

			// Create pages
			try {
				const pagesToCreate = [
					'Home',
					'List of publications',
					'Research',
					'Publications in Cadmus',
					'Work in progress'
				]
				const createdPages = []

				for (let i = 0, ilen = pagesToCreate.length; i < ilen; i++) {
					const createdPage = await ManagementClient.entries.create({
						title: pagesToCreate[i],
						pageSlug: slugify(pagesToCreate[i], { lower: true }),
						content: '',
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

					createdPages.push(createdPage)
				}
			} catch (e) {
				console.error('Error while creating pages: ', e)
				error(e.status, 'Error while creating pages')
			}

			return { createdPersonalWebsite }
		} catch (e) {
			console.error('Error while creating personal website:', e)
			return fail(e.status, { error: 'Something went wrong while creating the personal website' })
		}
	}
}
