import { ManagementClient } from '$lib/utils/contensis/_clients'
import { fileToFileBuffer, uploadAsset } from '$lib/utils/contensis/server.js'
import { base64toFile } from '$lib/utils/utils.js'
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
				// Handle image change
				if (value && typeof value === 'string' && value.includes('"base64"')) {
					// Delete old file first
					if (latestEntry[field]?.asset?.sys?.id) {
						await ManagementClient.entries.delete(latestEntry[field].asset.sys.id)
					}

					const photoObj = JSON.parse(value)
					const file = base64toFile(photoObj.base64)
					const { fileBuffer, filename } = await fileToFileBuffer(file)

					const uploadedImage = await uploadAsset(fileBuffer, photoObj.metadata.filename, {
						title: photoObj.metadata?.filename ?? filename,
						description: photoObj.metadata?.altText ?? 'Cover for blogpost',
						folderId: photoObj.metadata?.folderId ?? 'Content-Types-Assets/PersonalWebsites',
						contentType: file.type
					})

					latestEntry[field] = {
						altText: photoObj.metadata?.altText ?? 'Cover for blogpost',
						asset: {
							sys: {
								id: uploadedImage.sys.id,
								language: 'en-GB',
								dataFormat: 'asset'
							}
						}
					}
				} else {
					latestEntry[field] = value
				}
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
