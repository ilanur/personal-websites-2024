import { SvelteKitAuth } from '@auth/sveltekit'
import Entra from '@auth/sveltekit/providers/microsoft-entra-id'
import { PRIVATE_CLIENT_ID, PRIVATE_CLIENT_SECRET, PRIVATE_TENANT_ID, PRIVATE_AUTH_SECRET } from '$env/static/private'

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
	const authOptions = {
		providers: [
			Entra({
				clientId: PRIVATE_CLIENT_ID,
				clientSecret: PRIVATE_CLIENT_SECRET,
				tenantId: PRIVATE_TENANT_ID,
				issuer: `https://login.microsoftonline.com/${PRIVATE_TENANT_ID}/v2.0`
			})
		],
		secret: PRIVATE_AUTH_SECRET,
		trustHost: true
	}

	return authOptions
})
