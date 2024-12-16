import { ManagementClient } from '$lib/utils/contensis/_clients.js'
import { uploadAsset } from '$lib/utils/contensis/server.js'
import { json } from '@sveltejs/kit'

export const POST = async ({ request }) => {
	const formData = Object.fromEntries(await request.formData())
	console.log(formData)

	if (formData.image.size !== 0) {
		const arrayBuffer = await formData.image.arrayBuffer()
		const fileBuffer = Buffer.from(arrayBuffer)
		const filename = formData.image.name

		try {
			const uploadedPhoto = await uploadAsset(fileBuffer, filename, {
				description: 'Photo uploaded from Personal website.',
				folderId: formData.folder,
				contentType: formData.image.type,
				title: 'uploaded-page-photo'
			})

			console.log(uploadedPhoto)

			await ManagementClient.entries.invokeWorkflow(uploadedPhoto, 'draft.publish')

			return json(
				{
					message: 'success',
					uploadedPhoto
				},
				200
			)
		} catch (e) {
			console.error('Error uploading photo: ', e)
			return fail(500, {
				error: 'Error uploading photo'
			})
		}
	}

	return json(
		{
			message: 'success'
		},
		200
	)
}
