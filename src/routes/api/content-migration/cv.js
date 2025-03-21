import { ManagementClient } from '$lib/utils/contensis/_clients'
import { importAsset } from './importAsset'

export async function deleteAndReuploadCV(personalWebsite, personalData) {
	let cv

	try {
		if (personalWebsite.cv) {
			console.log('Deleting CV', personalWebsite.cv.sys.id)
			try {
				await ManagementClient.entries.delete(personalWebsite.cv.sys.id, ['en-GB'], true)
			} catch (e) {
				console.error('Failed to delete CV', e)
			}
		}

		if (personalData.user.cv) {
			try {
				cv = await importAsset(
					personalData.user.cv,
					`${personalData.title.rendered} CV`,
					`CV for ${personalData.title.rendered}`,
					'/Content-Types-Assets/PersonalWebsites/CVs'
				)
			} catch (e) {
				console.error('Failed to import CV', e)
			}
		}
	} catch (e) {
		console.error('Failed to delete old CV', e)
	}

	return cv
}
