export const actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData())
		console.log(formData)
	}
}
