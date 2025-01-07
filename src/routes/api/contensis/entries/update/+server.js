import { ManagementClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'

export const PUT = async ({ request }) => {
	const body = await request.json()

	try {
		const latestEntry = await ManagementClient.entries.get(body.entry.sys.id)

		for (const updatedField of body.updatedFields) {
			latestEntry[updatedField] = body.entry[updatedField]
		}

		const updatedEntry = await ManagementClient.entries.update(latestEntry)

		if (updatedEntry.sys.workflow.state === 'draft') {
			await ManagementClient.entries.invokeWorkflow(updatedEntry, 'draft.publish')
		}

		return json(200, {
			message: 'Success'
		})
	} catch (e) {
		console.error(e.data)
		error(500, 'Error while updating entry')
	}
}
