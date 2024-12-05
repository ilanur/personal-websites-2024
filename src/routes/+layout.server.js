import { getPersonalWebsiteByEmail } from '$lib/utils/contensis/server'

export async function load(event) {
	const session = await event.locals.auth()
	const personalWebsite = await getPersonalWebsiteByEmail(session.user.email)

	return {
		authUser: session ? session.user : null,
		personalWebsite: personalWebsite ? personalWebsite : null
	}
}
