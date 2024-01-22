export async function load(event) {
	console.log(event.locals.getSession())
	return {
		session: await event.locals.getSession()
	};
}
