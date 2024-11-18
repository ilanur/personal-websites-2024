import { SvelteKitAuth } from '@auth/sveltekit'
import Entra from '@auth/sveltekit/providers/microsoft-entra-id'
import {
	PRIVATE_AUTH_MICROSOFT_ENTRA_ID_ID,
	PRIVATE_AUTH_MICROSOFT_ENTRA_ID_SECRET,
	PRIVATE_AUTH_MICROSOFT_ENTRA_ID_TENANT_ID
} from '$env/static/private'

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Entra({
			clientId: PRIVATE_AUTH_MICROSOFT_ENTRA_ID_ID,
			clientSecret: PRIVATE_AUTH_MICROSOFT_ENTRA_ID_SECRET,
			tenantId: PRIVATE_AUTH_MICROSOFT_ENTRA_ID_TENANT_ID
		})
	],
	pages: {
		signIn: '/auth/login'
	}
})
