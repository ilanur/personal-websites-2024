import useDirectus from '$lib/composables/useDirectus.js'

export async function load({ parent }) {
	const { getPageContent } = useDirectus()
	const parentRes = await parent()
	const pageRes = await getPageContent(parentRes.personalInformation.id, 'about')

	return {
		page: pageRes.length ? pageRes[0] : []
	}
}
