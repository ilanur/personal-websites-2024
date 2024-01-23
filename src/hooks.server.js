import {
	SECRET_CLIENT_ID,
	SECRET_CLIENT_SECRET,
	SECRET_TENANT_ID,
	SECRET_AUTH_SECRET
} from '$env/static/private';

import AzureAd from '@auth/core/providers/azure-ad';
import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import { redirect } from '@sveltejs/kit';

const handleAuth = SvelteKitAuth({
	trustHost: true,
	providers: [
		AzureAd({
			clientId: SECRET_CLIENT_ID,
			clientSecret: SECRET_CLIENT_SECRET,
			tenantId: SECRET_TENANT_ID
		})
	],
	secret: SECRET_AUTH_SECRET,
	callbacks: {
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			return session;
		},
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}

			return token;
		},
		redirect: async ({ url, baseUrl }) => {
			if (url === baseUrl) {
				return `${baseUrl}/`;
			}

			return url;
		}
	}
});

async function isAuthenticatedUser({ event, resolve }) {
	// Any page in the protected/ folder will be for authenticated users.
	if (event.url.pathname.startsWith('/')) {
		const session = await event.locals.getSession();
		if (!session) {
			redirect(303, '/auth/signin');
		}
	}

	return await resolve(event);
}

export const handle = sequence(handleAuth, isAuthenticatedUser);
