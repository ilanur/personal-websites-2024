import { ManagementClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'

export const PUT = async ({ request }) => {
	const body = await request.json()

	try {
		const latestEntry = await ManagementClient.entries.get(body.sys.id)

		for (const [field, value] of Object.entries(body)) {
			if (value?.sys && value.sys.dataFormat === 'entry') {
				latestEntry[field] = {
					sys: {
						id: value.sys.id,
						contentTypeId: value.sys.contentTypeId
					}
				}
			} else if (field !== 'sys') {
				latestEntry[field] = value
			}
		}

		const updatedEntry = await ManagementClient.entries.update(latestEntry)

		if (updatedEntry.sys.workflow.state === 'draft') {
			await ManagementClient.entries.invokeWorkflow(updatedEntry, 'draft.publish')
		}

		return json(updatedEntry, 200)
	} catch (e) {
		console.error(e.data ?? e)
		error(500, 'Error while updating entry')
	}
}
