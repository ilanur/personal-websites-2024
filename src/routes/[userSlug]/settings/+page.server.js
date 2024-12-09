import formatZodError from '$lib/utils/format-zod-error.js'
import { PersonalWebsiteForm } from '$lib/zod-schemas/personal-website-form.js'
import { fail, json, redirect } from '@sveltejs/kit'

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
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData())
		console.log('formData', formData)

		const formValidation = PersonalWebsiteForm.safeParse(formData)

		if (!formValidation.success) {
			console.log('Form not valid', formValidation.error)
			console.log('Formnatted', formatZodError(formValidation.error))
			return fail(400, { formErrors: JSON.stringify(formValidation.error) })
		}

		return {
			success: true
		}
	}
}
