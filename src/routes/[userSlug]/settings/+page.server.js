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
			}

			const updatedPersonalWebsite = await ManagementClient.entries.update(personalWebsite)
			await ManagementClient.entries.invokeWorkflow(updatedPersonalWebsite, 'draft.publish')

			return { success: true, updatedPersonalWebsite }
		} catch (e) {
			console.error('Error while updating personal website entry:', e.data)
			error(e.status, 'Error while updating personal website entry')
		}
	}
}
