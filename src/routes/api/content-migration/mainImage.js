import { ManagementClient } from '$lib/utils/contensis/_clients'
import { importAsset } from './importAsset'

export async function deleteAndReuploadMainImage(personalWebsite, personalData) {
	let image

	try {
		if (personalWebsite.image) {
			try {
				await ManagementClient.entries.delete(personalWebsite.image.asset.sys.id, ['en-GB'], true)
			} catch (e) {
				console.error('Failed to delete main image', e)
			}
		}

		if (personalData.user.user_picture) {
			try {
				image = await importAsset(
					personalData.user.user_picture,
					personalData.title.rendered,
					`Image for ${personalData.title.rendered}`,
					'/Content-Types-Assets/PersonalWebsites/Profiles'
				)
			} catch (e) {
				console.error('Failed to import main image', e)
			}
		}
	} catch (e) {
		console.error('Failed to update main image', e)
	}

	return image
}
