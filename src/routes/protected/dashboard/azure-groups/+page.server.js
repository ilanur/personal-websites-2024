import {getAccessToken, getGroupMembers, getMemberGroups, searchGroupsByDisplayName, getUserGroupByEmail} from '$lib/utils/azureGraph';
import { createUser, enrollUserInCourse } from '$lib/utils/brightSpace';
let groups = [];
let groupMembers = [];
let searchQuery = "";
/** @type {import('./$types').Actions} */
export const actions = {
	
	searchGroups: async ({request, event}) => {
		const data = await request.formData();
		searchQuery = data.get('searchQuery');
		const accessToken = await getAccessToken();
		groups = await searchGroupsByDisplayName(searchQuery, accessToken);
		return {
			//memberGroups: memberGroups,
			groups: groups,
			searchQuery: searchQuery
		}
	},
	fetchUsers: async ({request, event}) => {
		const data = await request.formData();
		const selectedGroupIds = data.getAll('selectedGroups');

		const allGroupMembers = [];
		const accessToken = await getAccessToken();

		// Use Promise.all to fetch members from all selected groups concurrently
		await Promise.all(selectedGroupIds.map(async groupId => {
			const groupMembers = await getGroupMembers(groupId, accessToken);
			allGroupMembers.push(...groupMembers);
		}));
		//console.log(allGroupMembers);
		return {
			groupMembers: allGroupMembers,

		};
	},

	enrollUsersInCourse: async ({request, event }) => {
		console.log("qui2")
        const data = await request.formData();
		console.log(data);
        const courseId = data.get('courseId');
		console.log(members);
        for (let member of members) {
            // Check if user exists in Brightspace, if not, create them
            // For simplicity, I'm assuming a direct creation. You might need to handle this differently.
           // const user = await createUser(member);
            
            // Enroll the user in the course
            //await enrollUserInCourse(user.id, courseId);
        }

        return {
            message: 'Users enrolled successfully!'
        };
    }

	
};

/** @type {import('./$types').PageServerLoad} */
export async function load( { params, page } ) {
	console.log(params);
	console.log("load");
	//const { loggedInccessToken } = await event.locals.getSession();

	return {
		groups,
		groupMembers,
		searchQuery
	};
}
