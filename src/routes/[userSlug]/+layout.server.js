import { redirect } from '@sveltejs/kit'
import useDirectus from '$lib/composables/useDirectus.js'

export async function load({ params }) {
	if (!params.userSlug) throw redirect(302, '/')

	const { getPersonalInformationBySlug, getUserPages } = useDirectus()

	const personalInformation = await getPersonalInformationBySlug(params.userSlug)

	if (!personalInformation.length) redirect(302, '/')

	const userPages = await getUserPages(personalInformation[0].id)

	return {
		personalInformation: personalInformation[0] || undefined,
		userPages
	}
}
