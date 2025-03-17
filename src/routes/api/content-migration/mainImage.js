import { ManagementClient } from '$lib/utils/contensis/_clients'
import { importAsset } from './importAsset'

export async function deleteAndReuploadMainImage(personalWebsite, personalData) {
	let image

	try {
		// First delete old image.
		if (personalWebsite.image) {
			await ManagementClient.entries.delete(personalWebsite.image.asset.sys.id)
		}

		// Re-upload new one.
		image = await importAsset(
			personalData.user.user_picture,
			personalData.title.rendered,
			`Image for ${personalData.title.rendered}`,
			'/Content-Types-Assets/PersonalWebsites'
		)
	} catch (e) {
		console.error('Failed to update main image', e)
	}

	return image
}
