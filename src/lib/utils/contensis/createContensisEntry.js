import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_MANAGEMENT_URL } from '$env/static/public'
import authenticateContensis from './authenticateContensis'

async function createContensisEntry(payload, auth = null, contensisProject = 'personalWebsites') {
	try {
		const authData = auth ?? (await authenticateContensis())
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/${contensisProject}/entries`
		const createdEntry = await ofetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${authData.access_token}`
			},
			body: payload
		})

		return createdEntry
	} catch (e) {
		console.error('Error while creating Contensis entry:', e.data)
		error(e.status, e.data)
	}
}

export default createContensisEntry
