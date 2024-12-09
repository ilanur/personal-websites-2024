export default function formatZodError(formErrors) {
	return Object.fromEntries(formErrors.issues.map((el) => [el.path[0], el.message]))
}
