import { ManagementClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'

export const PUT = async ({ request }) => {
	const body = await request.json()

	try {
		const latestEntry = await ManagementClient.entries.get(body.sys.id)

		for (let [field, value] of Object.entries(body)) {
			if (Array.isArray(value) && value.every((item) => item?.sys?.dataFormat === 'entry')) {
				latestEntry[field] = value.map((item) => ({
					sys: {
						id: item.sys.id,
						dataFormat: 'entry',
						contentTypeId: item.sys.contentTypeId
					}
				}))
			} else if (value?.sys?.dataFormat === 'entry') {
				latestEntry[field] = {
					sys: {
						id: value.sys.id,
						dataFormat: 'entry',
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
