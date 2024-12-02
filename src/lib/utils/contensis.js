import { PUBLIC_CONTENSIS_MANAGEMENT_URL, PUBLIC_CONTENSIS_URL } from '$env/static/public'
import { error } from '@sveltejs/kit'
import { ofetch } from 'ofetch'
import { DeliveryClient, ManagementClient } from './contensis-clients'

export async function getPeopleEntryByEmail(email) {
	try {
		const contensisUsers = await DeliveryClient.entries.search({
			where: [
				{ field: 'sys.contentTypeId', equalTo: 'people' },
				{ field: 'sys.versionStatus', equalTo: 'published' },
				{ field: 'euiEmail', equalTo: email }
			]
		})

		if (!contensisUsers.items.length) return null

		return contensisUsers.items[0]
	} catch (e) {
		console.error('Error while getting people entry:', e.data)
		if (e.status === 404) return null
		error(e.status, e.data)
	}
}

export async function getPersonalWebsiteByEmail(email) {
	// Pieter-Jan to check why this is not working
	try {
		const personalWebsites = await DeliveryClient.entries.search(
			{
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'personalWebsites' },
					{ field: 'sys.versionStatus', equalTo: 'published' },
					{ field: 'people.email', equalTo: email }
				]
			},
			2
		)

		console.log('email', email)
		console.log('personalWebsites', personalWebsites)

		if (!personalWebsites.items.length) return null

		return personalWebsites.items[0]
	} catch (e) {
		console.error('Error while getting personal Website entry:', e.data)
		if (e.status === 404) return null
		error(e.status, e.data)
	}
}

export async function authenticateContensis() {
	try {
		const url = `${PUBLIC_CONTENSIS_URL}/authenticate/connect/token`
		const authData = await ofetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			},
			body: 'grant_type=client_credentials&client_id=fb9b7d09-ef9a-4c25-b2fb-df70f433f7ce&client_secret=977f1df8de174d5fbccd058a1abd74c8-6d0be4cb4f924667aa8646f9961b6ba4-935b9336f5bf4e68ad02c8abbfaa1ae4&scope=Entry_Read Entry_Write Entry_Delete ContentType_Read Project_Read'
		})

		return authData
	} catch (e) {
		console.error('Error in authenticating contensis:', e)
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

		// Create a new asset entry
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

		return createdEntry
	} catch (e) {
		console.error('Error uploading asset to Contensis:', e)
		throw error(400, `Failed to upload asset: ${e.message}`)
	}
}
