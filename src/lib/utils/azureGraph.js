// import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, SECRET_TENANT_ID } from '$env/static/private';

// //GET THE CURRENT AUTH USER GROUPS
// /*const response = await fetch('https://graph.microsoft.com/v1.0/me/getMemberGroups', {
// 		method: 'POST',
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			securityEnabledOnly: true
// 		})
// 	});

// 	const memberGroups = await response.json();
// */

// export async function getGroupMembers(groupId, accessToken) {
// 	try {
// 		const response = await fetch(`https://graph.microsoft.com/v1.0/groups/${groupId}/members`, {
// 			method: 'GET',
// 			headers: {
// 				Authorization: `Bearer ${accessToken}`,
// 				'Content-Type': 'application/json'
// 			}
// 		});

// 		if (!response.ok) {
// 			throw new Error('Failed to retrieve group members');
// 		}

// 		const data = await response.json();
// 		return data.value;
// 	} catch (error) {
// 		console.error('Error getting group members:', error);
// 		throw error;
// 	}
// }

// export async function getUserGroupByEmail(email, accessToken) {
// 	try {
// 		// Step 1: Get user ID using the email
// 		const response = await fetch(`https://graph.microsoft.com/v1.0/users/${email}`, {
// 			method: 'GET',
// 			headers: {
// 				Authorization: `Bearer ${accessToken}`,
// 				'Content-Type': 'application/json'
// 			}
// 		});

// 		if (!response.ok) {
// 			throw new Error('Failed to get user ID');
// 		}

// 		const userData = await response.json();
// 		console.log(userData);
// 		const userId = userData.id;

// 		// Step 2: Get user groups using the user ID
// 		const groupsResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}/getMemberGroups`, {
// 			method: 'POST',
// 			headers: {
// 				Authorization: `Bearer ${accessToken}`,
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({
// 				securityEnabledOnly: true
// 			})
// 		});

// 		if (!groupsResponse.ok) {
// 			throw new Error('Failed to get user groups');
// 		}

// 		const groupsData = await groupsResponse.json();
// 		const groupIds = groupsData.value;

// 		// Step 3: Get group details using group IDs
// 		const groupDetailsPromises = groupIds.map((groupId) =>
// 			fetch(`https://graph.microsoft.com/v1.0/groups/${groupId}`, {
// 				method: 'GET',
// 				headers: {
// 					Authorization: `Bearer ${accessToken}`,
// 					'Content-Type': 'application/json'
// 				}
// 			}).then((res) => res.json())
// 		);

// 		const groupDetails = await Promise.all(groupDetailsPromises);

// 		// Step 4: Get group display names from group details
// 		const groupDisplayNames = groupDetails.map((details) => details.displayName);

// 		return groupDisplayNames;
// 	} catch (error) {
// 		console.error('Error getting user groups by email:', error);
// 		throw error;
// 	}
// }

// export async function searchGroupsByDisplayName(displayName, accessToken) {
// 	try {
// 		let groups = [];
// 		let query = `https://graph.microsoft.com/v1.0/groups?$filter=startswith(displayName, '${displayName}')`;

// 		if (displayName == '') {
// 			query = `https://graph.microsoft.com/v1.0/groups`;
// 		}
// 		const response = await fetch(query, {
// 			method: 'GET',
// 			headers: {
// 				Authorization: `Bearer ${accessToken}`,
// 				'Content-Type': 'application/json'
// 			}
// 		});

// 		if (!response.ok) {
// 			throw new Error('Failed to search groups by displayName');
// 		}

// 		const data = await response.json();

// 		if (data) {
// 			groups = data.value.map((group) => ({
// 				id: group.id,
// 				displayName: group.displayName,
// 				description: group.description
// 			}));
// 		}

// 		return groups;
// 	} catch (error) {
// 		console.error('Error searching groups by displayName:', error);
// 		throw error;
// 	}
// }

// export async function getAccessToken() {
// 	try {
// 		const clientId = SECRET_CLIENT_ID;
// 		const clientSecret = SECRET_CLIENT_SECRET;
// 		const tenantId = SECRET_TENANT_ID;

// 		const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
// 		const params = new URLSearchParams();

// 		params.append('grant_type', 'client_credentials');
// 		params.append('client_id', clientId);
// 		params.append('client_secret', clientSecret);
// 		params.append('scope', 'https://graph.microsoft.com/.default');

// 		const response = await fetch(url, {
// 			method: 'POST',
// 			body: params,
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded'
// 			}
// 		});

// 		if (!response.ok) {
// 			throw new Error('Failed to retrieve access token');
// 		}

// 		const data = await response.json();
// 		//console.log ("Data:", data);
// 		return data.access_token;
// 	} catch (error) {
// 		console.error('Error acquiring access token:', error);
// 		throw error;
// 	}
// }
