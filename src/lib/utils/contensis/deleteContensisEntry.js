import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_MANAGEMENT_URL } from '$env/static/public'
import authenticateContensis from './authenticateContensis'

async function deleteContensisEntry(
	entryId,
	permanent = false,
	auth = null,
	contensisProject = 'personalWebsites'
) {
	try {
		const authData = auth ?? (await authenticateContensis())
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/${contensisProject}/entries/${entryId}`

		const response = await ofetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${authData.access_token}`
			},
			query: {
				language: 'en',
				permanent
			}
		})

		return response
	} catch (e) {
		console.error('Error while deleting Contensis entry:', e.data)
		error(e.status, e.data)
	}
}

export default deleteContensisEntry
