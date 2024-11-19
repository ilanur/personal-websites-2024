import { PUBLIC_CONTENSIS_MANAGEMENT_URL, PUBLIC_CONTENSIS_URL } from '$env/static/public'
import { error } from '@sveltejs/kit'
import { ofetch } from 'ofetch'
import { ManagementClient } from './contensis-clients'

export async function authenticateContensis() {
	try {
		const url = `${PUBLIC_CONTENSIS_URL}/authenticate/connect/token`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			},
			body: 'grant_type=client_credentials&client_id=fb9b7d09-ef9a-4c25-b2fb-df70f433f7ce&client_secret=977f1df8de174d5fbccd058a1abd74c8-6d0be4cb4f924667aa8646f9961b6ba4-935b9336f5bf4e68ad02c8abbfaa1ae4&scope=Entry_Read Entry_Write Entry_Delete ContentType_Read Project_Read'
		})

		if (!response.ok) {
			return {
				status: response.status,
				body: {
					error: `Failed to authenticate: ${response.statusText}`
				}
			}
		}

		const data = await response.json()
		return data
	} catch (e) {
		console.error('Error in authenticating contensis: ' + e)
		return { error: e }
	}
}

export async function uploadAsset(fileBuffer, filename, options = {}) {
	try {
		const {
			language = 'en-GB',
			description = '',
			folderId = '',
			title = filename,
			contentType = 'audio/mpeg'
		} = options

		const authData = await authenticateContensis()

		// Create FormData with both metadata and file
		const formData = new FormData()

		// Add metadata as JSON
		const metadata = {
			title: title,
			description: description,
			language: language,
			folderId: folderId,
			properties: {
				contentType: contentType
			}
		}

		formData.append('metadata', JSON.stringify(metadata))
		console.log('metadata', metadata)
		const blob = new Blob([fileBuffer], { type: contentType })
		formData.append('file', blob, filename)

		// Single request to create and upload asset
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/assets`
		const asset = await ofetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${authData.access_token}`
			},
			body: formData
		})

		console.log('asset created')
		//Create a new asset entry
		const entryData = {
			title: title,

			sysAssetFile: {
				fileId: asset[0].fileId,
				parentNodePath: folderId
			},

			sys: {
				projectId: 'euiWebsite',
				dataFormat: 'asset'
			}
		}

		const createdEntry = await ManagementClient.entries.create(entryData)

		console.log('Entry asset created')

		return createdEntry
	} catch (e) {
		console.error('Error uploading asset to Contensis:', e)
		throw error(400, `Failed to upload audio asset: ${e.message}`)
	}
}
