import { getPersonalWebsiteByEmail } from '$lib/utils/contensis/server'

export async function load(event) {
	const session = await event.locals.auth()
	let personalWebsite = null
	if (session?.user) {
		personalWebsite = await getPersonalWebsiteByEmail(session.user.email)
	}

	return {
		authUser: session ? session.user : null,
		currentUserPersonalWebsite: personalWebsite ? personalWebsite : null
	}
}
