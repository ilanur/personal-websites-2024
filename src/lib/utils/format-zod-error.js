export default function formatZodError(formErrors) {
	console.log('FORMERRORS:', formErrors)
	return formErrors.reduce((acc, item) => {
		const key = item.path[0]
		const { path, ...rest } = item

		acc[key] = rest

		return acc
	}, {})
}
