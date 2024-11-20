import { redirect } from '@sveltejs/kit'

export function load({ params }) {
	redirect(302, `/${params.userSlug}`)
}
