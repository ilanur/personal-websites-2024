import formatZodError from '$lib/utils/format-zod-error.js'
import { pwFormSchema } from '$lib/zod-schemas/personal-website-form.js'
import { fail, redirect } from '@sveltejs/kit'

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
		const formValidation = pwFormSchema.safeParse(formData)

		console.log('formData', formData)

		if (!formValidation.success) {
			return fail(400, { success: false, formErrors: formatZodError(formValidation.error) })
		}

		return {
			success: true
		}
	}
}
