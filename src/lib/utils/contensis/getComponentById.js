import { ofetch } from 'ofetch'
import { error } from '@sveltejs/kit'
import { PUBLIC_CONTENSIS_MANAGEMENT_URL } from '$env/static/public'
import authenticateContensis from './authenticateContensis'

async function getComponentById(componentId, auth = null, contensisProject = 'personalWebsites') {
	try {
		const authData = auth ?? (await authenticateContensis())
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/${contensisProject}/components/${componentId}`

		const component = await ofetch(url, {
			headers: {
				Authorization: `Bearer ${authData.access_token}`
			}
		})

		return component
	} catch (e) {
		console.error('Error while getting Contensis component:', e.data)
		error(e.status, e.data)
	}
}

export default getComponentById
