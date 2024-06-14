import { SvelteKitAuth } from '@auth/sveltekit';
import Entra from '@auth/sveltekit/providers/microsoft-entra-id';
import {
	AUTH_MICROSOFT_ENTRA_ID_ID,
	AUTH_MICROSOFT_ENTRA_ID_SECRET,
	AUTH_MICROSOFT_ENTRA_ID_TENANT_ID
} from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Entra({
			clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
			clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
			tenantId: AUTH_MICROSOFT_ENTRA_ID_TENANT_ID
		})
	],
	pages: {
		signIn: '/auth/login'
	}
});
