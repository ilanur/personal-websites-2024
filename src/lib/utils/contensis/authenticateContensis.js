import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_URL, PUBLIC_CONSTENSIS_CLIENT_ID } from '$env/static/public'
import { PRIVATE_CONTENSIS_CLIENT_SECRET } from '$env/static/private'

async function authenticateContensis() {
	try {
		const scopes = 'Entry_Read Entry_Write Entry_Delete ContentType_Read Project_Read'
		const url = `${PUBLIC_CONTENSIS_URL}/authenticate/connect/token`
		const data = await ofetch(url, {
			method: 'POST',
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: PUBLIC_CONSTENSIS_CLIENT_ID,
				client_secret: PRIVATE_CONTENSIS_CLIENT_SECRET,
				scope: scopes
			})
		})

		return data
	} catch (e) {
		console.error('Error while authenticating to contensis:', e)
		error(e.status, e.data)
	}
}

export default authenticateContensis
