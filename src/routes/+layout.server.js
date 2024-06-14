export async function load(event) {
	const session = await event.locals.auth();

	return {
		authUser: session ? session.user : null
	};
}
