import { getAccessToken, getGroupMembers, getMemberGroups, searchGroupsByDisplayName, getUserGroupByEmail } from '$lib/utils/azureGraph';
let groups = [];
let groupMembers = [];
let searchQuery = '';
/** @type {import('./$types').Actions} */
export const actions = {
	searchGroups: async ({ request, event }) => {
		const data = await request.formData();
		searchQuery = data.get('searchQuery');
		const accessToken = await getAccessToken();
		groups = await searchGroupsByDisplayName(searchQuery, accessToken);
		return {
			//memberGroups: memberGroups,
			groups: groups,
			searchQuery: searchQuery
		};
	},
	fetchUsers: async ({ request, event }) => {
		const data = await request.formData();
		const selectedGroupIds = data.getAll('selectedGroups');

		const allGroupMembers = [];
		const accessToken = await getAccessToken();

		// Use Promise.all to fetch members from all selected groups concurrently
		await Promise.all(
			selectedGroupIds.map(async (groupId) => {
				const groupMembers = await getGroupMembers(groupId, accessToken);
				allGroupMembers.push(...groupMembers);
			})
		);
		//console.log(allGroupMembers);
		return {
			groupMembers: allGroupMembers
		};
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, page }) {
	console.log(params);
	console.log('load');
	//const { loggedInccessToken } = await event.locals.getSession();

	return {
		groups,
		groupMembers,
		searchQuery
	};
}
