import jwt from 'jsonwebtoken';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { id_token } = await request.json();

		const response = await fetch(
			'https://cms-eui.cloud.contensis.com/authenticate/.well-known/openid-configuration'
		);
		const { jwks_uri } = await response.json();

		const jwksResponse = await fetch(jwks_uri);
		const { keys } = await jwksResponse.json();

		const signingKey = keys.find((key) => key.use === 'sig' && key.kty === 'RSA');

		if (!signingKey || !signingKey.x5c || signingKey.x5c.length === 0) {
			console.error('Valid signing key not found.');
			return json({ status: 500, body: { error: 'Valid signing key not found.' } });
		}

		const pem = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`;

		const decoded = jwt.verify(id_token, pem, { algorithms: ['RS256'] });

		const userid = decoded.sub;

		const accessToken = await getAccessToken();
		const userInfo = await getUserInfo(userid, accessToken);

		return json({
			status: 200,
			user: userInfo
		});
	} catch (error) {
		console.error('Error validating token:', error);
		return json({
			status: 500,
			body: { error: 'Failed to validate token: ' + error.message }
		});
	}
};

async function getUserInfo(userid, accessToken) {
	const response = await fetch('https://cms-eui.cloud.contensis.com/api/security/users/' + userid, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});
	if (!response.ok) {
		console.error('Failed to fetch user info, status:', response.status);
		throw new Error(`Failed to retrieve user information, HTTP status ${response.status}`);
	}
	const user = await response.json();
	if (!user) {
		throw new Error('Empty response from user information endpoint');
	}
	return user;
}

async function getAccessToken() {
	const response = await fetch('https://cms-eui.cloud.contensis.com/authenticate/connect/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		},
		body: `grant_type=client_credentials&
        client_id=fb9b7d09-ef9a-4c25-b2fb-df70f433f7ce&
        client_secret=977f1df8de174d5fbccd058a1abd74c8-6d0be4cb4f924667aa8646f9961b6ba4-935b9336f5bf4e68ad02c8abbfaa1ae4&
        scope=Entry_Read Entry_Write ContentType_Read Project_Read`
	});

	const data = await response.json();
	return data.access_token;
}
