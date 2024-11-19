import { fail, redirect } from '@sveltejs/kit'
import { ManagementNodeClient, DeliveryClient } from '$lib/utils/contensis-clients.js'
import getPeopleEntryByEmail from '$lib/utils/contensis/getPeopleEntryByEmail.js'
import slugify from 'slugify'

export async function load(event) {
	// Check if has session
	const session = await event.locals.auth()
	if (!session) redirect(302, '/')

	// Check if user exists in the people collection in Contensis
	const contensisUser = await getPeopleEntryByEmail('emanuele.strano@eui.eu')
	// const contensisUser = await getPeopleEntryByEmail(session.user.email) // --> Enable this line to use real user

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
	const nationalities = await ManagementNodeClient.components.get('nationalities')

	return {
		contensisUser,
		nationalities: nationalities.fields.length
			? nationalities.fields[0].validations.allowedValues.values
			: []
	}
}

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = Object.fromEntries(await request.formData())

			// Get contensis user from the People collection in the euiWebsite project.
			const contensisUser = await getPeopleEntryByEmail(formData.email)

			// Create necessary pages
			const pagesToCreate = ['About', 'Research', 'Publications', 'Teaching']
			const createdPages = []

			for (let i = 0, ilen = pagesToCreate.length; i < ilen; i++) {
				const createdPage = await ManagementNodeClient.entries.create({
					title: pagesToCreate[i],
					pageTemplate: slugify(pagesToCreate[i], { lower: true }),
					content: '',
					sys: {
						contentTypeId: 'pages',
						language: 'en',
						dataFormat: 'entry'
					}
				})

				await ManagementNodeClient.entries.invokeWorkflow(createdPage, 'draft.publish')

				createdPages.push(createdPage)
			}

			// Create personal website
			const createdPersonalWebsite = await ManagementNodeClient.entries.create({
				title: contensisUser?.nameAndSurnameForTheWeb ?? formData.title,
				description: contensisUser?.aboutMe ?? '',
				email: contensisUser?.email ?? formData.email,
				websiteSlug: formData.slug,
				nationalities: {
					nationality: [formData.nationality]
				},
				peopleEntryId: contensisUser?.sys?.id ?? '',
				pages: createdPages.map((page) => ({
					sys: {
						id: page.sys.id,
						contentTypeId: 'pages'
					}
				})),
				sys: {
					contentTypeId: 'personalWebsite',
					language: 'en',
					dataFormat: 'entry'
				}
			})

			await ManagementNodeClient.entries.invokeWorkflow(createdPersonalWebsite, 'draft.publish')

			return { createdPersonalWebsite }
		} catch (e) {
			console.error('Error while creating personal website:', e)
			return fail(400, { error: 'Something went wrong while creating the personal website' })
		}
	}
}
