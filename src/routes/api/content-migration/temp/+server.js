import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'
import { ofetch } from 'ofetch'

export const POST = async () => {
	try {
		const pwEntry = await DeliveryClient.entries.get('35b97324-1cc0-412b-8325-5b1692c8ed1c')

		if (pwEntry) {
			const updatedPwEntry = await ManagementClient.entries.patch(pwEntry.sys.id, {
				photo: {
					altText: pwEntry.entryTitle,
					asset: {
						sys: {
							id: '42351cf8-d083-4c0a-829a-e8829b2648ee',
							language: 'en-GB',
							dataFormat: 'asset'
						}
					}
				}
			})

			await ManagementClient.entries.publish(updatedPwEntry)
		}

		return json(
			{
				success: true,
				data: {
					hasNoPeopleEntry
				}
			},
			{ status: 200 }
		)
	} catch (e) {
		console.error('Failed to fetch old CMS data', e.data ?? e)
		error(e.status, e.data)
	}
}
