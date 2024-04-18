import jwt from 'jsonwebtoken';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    try {
        const { id_token } = await request.json();
        
        const response = await fetch('https://cms-eui.cloud.contensis.com/authenticate/.well-known/openid-configuration');
        const { jwks_uri } = await response.json();

        const jwksResponse = await fetch(jwks_uri);
        const { keys } = await jwksResponse.json();

        const signingKey = keys.find(key => key.use === 'sig' && key.kty === 'RSA');
        
        if (!signingKey || !signingKey.x5c || signingKey.x5c.length === 0) {
            console.error('Valid signing key not found.');
            return json({ status: 500, body: { error: 'Valid signing key not found.' } });
        }

        const pem = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`;
        
        const decoded = jwt.verify(id_token, pem, { algorithms: ['RS256'] });
        
        console.log('Decoded JWT:', decoded);
        return json({
            status: 200,
            body: { user: decoded }
        });
    } catch (error) {
        console.error('Error validating token:', error);
        return json({
            status: 500,
            body: { error: 'Failed to validate token: ' + error.message }
        });
    }
};
