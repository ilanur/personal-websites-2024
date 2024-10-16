import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_MANAGEMENT_URL } from '$env/static/public'
import authenticateContensis from './authenticateContensis'

async function submitEvent(entry, event, message = '', contensisProject = 'personalWebsites') {
	try {
		const id = entry.sys.id
		console.log('entry', entry.sys.id)
		const latestVersion = entry.sys.version.versionNo
		console.log('latestVersion', latestVersion)

		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/${contensisProject}/entries/${id}/workflow/events`
		const authData = await authenticateContensis()
		const response = await ofetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${authData.access_token}`
			},
			body: {
				language: 'en',
				version: latestVersion,
				event,
				data: {
					message
				}
			}
		})

		return response
	} catch (e) {
		console.error('Error submitting contensis event: ', e)
		error(e.status, e.data)
	}
}

export default submitEvent
