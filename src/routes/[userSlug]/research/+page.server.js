import useDirectus from '$lib/composables/useDirectus.js';

export async function load({ parent }) {
	const { getPageContent } = useDirectus();
	const parentRes = await parent();
	const userId = parentRes.user.id;
	const pageRes = await getPageContent(userId, 'research');

	return {
		page: pageRes.length ? pageRes[0] : []
	};
}
