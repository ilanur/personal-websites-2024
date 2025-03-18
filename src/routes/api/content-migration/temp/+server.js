import { DeliveryClient, ManagementClient } from '$lib/utils/contensis/_clients'
import { error, json } from '@sveltejs/kit'

export const POST = async () => {
	try {
		const entry = await DeliveryClient.entries.get('ce58e038-31cf-4f18-8098-d1cb2fd9ba4d')

		if (entry) {
			const updatedEntry = await ManagementClient.entries.patch(entry.sys.id, {
				email: 'Marco.Cozzani@eui.eu',
				euiEmail: ''
			})

			await ManagementClient.entries.publish(updatedEntry)
		}

		return json(
			{
				success: true
			},
			{ status: 200 }
		)
	} catch (e) {
		console.error('Failed to fetch old CMS data', e.data ?? e)
		error(e.status, e.data)
	}
}
