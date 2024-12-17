import { getPersonalWebsiteByEmail } from '$lib/utils/contensis/server'
import { admins, coordinators } from '$lib/utils/permissions'
import { PUBLIC_PREVIEW_COOKIE_NAME, PUBLIC_PREVIEW_PARAM } from '$env/static/public'

export async function load({ locals, cookies, url }) {
	const isPreviewCookie = cookies.get(PUBLIC_PREVIEW_COOKIE_NAME) === 'true'
	const isPreviewParam = url.searchParams.get(PUBLIC_PREVIEW_PARAM) === 'true'

	const session = await locals.auth()
	let personalWebsite = null

	if (session?.user) {
		personalWebsite = await getPersonalWebsiteByEmail(session.user.email)
		session.user.role = admins.includes(session.user.email) ? 'admin' : 'user'
		session.user.role = coordinators.includes(session.user.email) ? 'coordinator' : session.user.role
	}

	return {
		authUser: session ? session.user : null,
		currentUserPersonalWebsite: personalWebsite ?? null,
		preview: {
			active: isPreviewCookie || isPreviewParam
		}
	}
}
