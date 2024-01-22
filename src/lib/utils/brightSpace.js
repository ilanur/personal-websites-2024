import {
	BRIGHTSPACE_CLIENT_ID,
	BRIGHTSPACE_CLIENT_SECRET,
    BRIGHTSPACE_BASE_URL
} from '$env/static/private';

async function getAccessToken() {
    const response = await fetch(`https://${BRIGHTSPACE_BASE_URL}/d2l/auth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=${BRIGHTSPACE_CLIENT_ID}&client_secret=${BRIGHTSPACE_CLIENT_SECRET}&grant_type=client_credentials`
    });

    const data = await response.json();
    return data.access_token;
}

export async function createUser(user) {
    const accessToken = await getAccessToken();

    const response = await fetch(`https://${BRIGHTSPACE_BASE_URL}/d2l/api/lp/1.26/users/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    return response.json();
}

export async function enrollUserInCourse(userId, courseId) {
    const accessToken = await getAccessToken();

    const response = await fetch(`https://${BRIGHTSPACE_BASE_URL}/d2l/api/lp/1.26/enrollments/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            OrgUnitId: courseId,
            UserId: userId
        })
    });

    return response.json();
}