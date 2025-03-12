import { uploadAsset } from '$lib/utils/contensis/server'

// Utility function to import assets (images or CVs)
export async function importAsset(url, title, description, folder) {
	try {
		// Download the asset
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Failed to download asset: ${response.statusText}`)
		}

		const arrayBuffer = await response.arrayBuffer()
		const fileBuffer = Buffer.from(arrayBuffer)
		const filename = url.split('/').pop()

		// Upload to Contensis
		const asset = await uploadAsset(fileBuffer, filename, {
			description,
			folderId: folder,
			contentType: response.headers.get('content-type'),
			title
		})

		return asset
	} catch (err) {
		console.error('Error downloading or uploading asset:', err)
		return null
	}
}
