import {
	PUBLIC_CONTENSIS_DELIVERY_URL,
	PUBLIC_CONTENSIS_MANAGEMENT_URL,
	PUBLIC_CONTENSIS_URL
} from '$env/static/public'
import { PRIVATE_CONTENSIS_ACCESS_TOKEN } from '$env/static/private'
import { PUBLIC_EUI_BASE_URL, PUBLIC_EUI_INTRANET_BASE_URL } from '$env/static/public'
import { error } from '@sveltejs/kit'
import { ofetch } from 'ofetch'

export async function createContensisEntry(entryData) {
	try {
		const authData = await authenticateContensis()
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/entries/`

		const createdEntry = await ofetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authData.access_token}`
			},
			body: JSON.stringify(entryData)
		})

		console.log('createdEntry', createdEntry)

		return createdEntry
	} catch (e) {
		console.error('Error in creating the entry: ', e)
		error(e)
	}
}

export async function editContensisEntry(entry, data) {
	try {
		const id = entry.sys.id
		const latestVersion = entry.sys.version.versionNo
		const contentTypeId = entry.sys.contentTypeId
		const slug = data.sys && data.sys.slug ? data.sys.slug : entry.sys.slug
		const uri = entry.sys.uri

		data.sys = {
			id,
			slug,
			projectId: 'euiWebsite',
			contentTypeId,
			language: 'en-GB',
			dataFormat: 'entry',
			uri,
			version: {
				versionNo: latestVersion
			}
		}

		const authData = await authenticateContensis()
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/entries/${id}`
		const response = await ofetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authData.access_token}`
			},
			body: JSON.stringify(data)
		})

		return response
	} catch (e) {
		console.error('Error in editing the entry: ' + e)
		return { error: e }
	}
}

export async function deleteContensisEntry(entryId, permanent = false) {
	try {
		const authData = await authenticateContensis()
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/entries/${entryId}?language=en-GB&permanent=${permanent}`

		await ofetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authData.access_token}`
			}
		})

		return true
	} catch (e) {
		console.error(`Failed to delete entry: ${e}`)
		error(e)
	}
}

export async function getContensisDataById(id, linkDepth = 0, versionStatus = 'published') {
	try {
		const url = `${PUBLIC_CONTENSIS_DELIVERY_URL}entries/${id}?linkDepth=${linkDepth}&accessToken=${PRIVATE_CONTENSIS_ACCESS_TOKEN}&versionStatus=${versionStatus}`
		return await ofetch(url)
	} catch (e) {
		console.error('Error while getting Contensis data:', e.status)
		error(e.status, e.data)
	}
}

export async function submitContensisEvent(entry, event, message = '') {
	try {
		const id = entry.sys.id
		const latestVersion = entry.sys.version.versionNo
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/entries/${id}/workflow/events`
		const authData = await authenticateContensis()
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authData.access_token}`
			},
			body: JSON.stringify({
				language: 'en-GB',
				version: latestVersion,
				event,
				data: {
					message
				}
			})
		})

		console.log('response', response)

		if (!response.ok) {
			return {
				status: response.status,
				body: {
					error: `Failed to submit event: ${response.statusText}`
				}
			}
		}

		const responseData = await response.json()
		return responseData
	} catch (e) {
		console.error('Error in submitting contensis event: ' + e)
		return { error: e }
	}
}

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

export async function fetchUsageData(entryId) {
	try {
		const token = await authenticateContensis() // Assuming you have a function to authenticate and get a token
		const url = `${PUBLIC_CONTENSIS_MANAGEMENT_URL}/entries/${entryId}/usage?versionStatus=published&pageSize=1000`

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.access_token}`
			}
		})

		const data = await response.json()

		if (data.items && data.items.length > 0) {
			// Exclude items with contentTypeId = "vectorEntry"
			data.items = data.items.filter((item) => item.contentTypeId !== 'vectorEntry')
			return data.items
		} else {
			return []
		}
	} catch (e) {
		console.error('Error in retrieving usage data: ' + e)
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

		const createdEntry = await createContensisEntry(entryData)
		console.log('Entry asset created')

		return createdEntry
	} catch (e) {
		console.error('Error uploading asset to Contensis:', e)
		throw error(400, `Failed to upload audio asset: ${e.message}`)
	}
}

export function clean_and_organiseEntry(entry, usageData = []) {
	const extractEntryData = (entry, role = '') => {
		if (entry.sys.contentTypeId === 'vectorEntry') {
			// Skip the entry if contentTypeId is vectorEntry
			return null
		}
		return {
			id: entry.sys.id,
			title: entry.entryTitle,
			contentTypeId: entry.sys.contentTypeId,
			role: role
		}
	}

	const extractUsageData = (entry) => {
		return {
			id: entry.id,
			title: entry.title,
			contentTypeId: entry.contentTypeId,
			role: entry.fieldId
		}
	}

	// Function to remove specific fields from entry
	const removeFields = (entry, fields) => {
		fields.forEach((field) => {
			delete entry[field]
		})
		return entry
	}

	// Function to handle URI adjustments
	const adjustUri = (uri) => {
		if (uri) {
			if (uri.includes('/en/eui-intranet/')) {
				return PUBLIC_EUI_INTRANET_BASE_URL + uri.replace('/en/eui-intranet/', '/')
			}
			return PUBLIC_EUI_BASE_URL + uri
		}
		return '' // Return empty string if uri is
	}

	// Construct thumbnail URL
	const getThumbnail = (thumbnail) =>
		thumbnail ? PUBLIC_EUI_BASE_URL + thumbnail.asset.sys.uri : ''

	// Remove sys and vectorData fields before processing
	let clean_entry = { ...entry }
	delete clean_entry.sys
	delete clean_entry.vectorData
	let slug = entry.sys?.slug || ''
	let thumbnail = entry.entryThumbnail ? getThumbnail(entry.entryThumbnail) : ''
	let uri = entry.sys?.uri ? adjustUri(entry.sys.uri) : ''
	let index = entry.sys?.contentTypeId

	// Structure the result based on type
	try {
		let themes = [],
			affiliations = [],
			url = '',
			fieldsToRemove = [],
			related_entries = [],
			usage_entries = [],
			useful_info = []

		switch (index) {
			case 'euiNews':
				themes = clean_entry.areasOfExpertise?.map(extractEntryData) || []
				affiliations = clean_entry.euiUnit?.map(extractEntryData) || []
				url = PUBLIC_EUI_BASE_URL + '/news-hub?id=' + slug
				fieldsToRemove = ['areasOfExpertise', 'euiUnit']
				break
			case 'programmes':
				themes = clean_entry.researchThemes?.map(extractEntryData) || []
				affiliations = clean_entry.affiliation?.map(extractEntryData) || []
				url = PUBLIC_EUI_BASE_URL + '/apply?id=' + slug
				fieldsToRemove = [
					'researchThemes',
					'affiliation',
					'informationForApplicants',
					'conditionsOfAward',
					'selectionCriteriaAndEligibility',
					'faqs',
					'socialMediaChannels',
					'programmeBrochure',
					'partnersList',
					'facultyAreaOfSupervision'
				]
				break
			case 'researchProjects':
				themes = clean_entry.affiliatedResearchThemes?.map(extractEntryData) || []
				affiliations = clean_entry.affiliation?.map(extractEntryData) || []
				related_entries =
					clean_entry.people?.map((person) => extractEntryData(person, 'people')) || []
				related_entries = related_entries.concat(
					clean_entry.coordinators?.map((coordinator) =>
						extractEntryData(coordinator, 'coordinator')
					) || []
				)
				url = PUBLIC_EUI_BASE_URL + '/research-hub?id=' + slug
				fieldsToRemove = ['affiliatedResearchThemes', 'people', 'affiliation', 'coordinators']
				break
			case 'people':
				themes = clean_entry.researchThemes?.map(extractEntryData) || []
				url = PUBLIC_EUI_BASE_URL + '/people?id=' + slug
				clean_entry.roles?.map((role) => {
					if (role.affiliation) {
						affiliations.push(extractEntryData(role.affiliation, role.role))
					}
				})
				if (clean_entry.type) {
					useful_info.push('User type: ' + clean_entry.type)
				}
				usage_entries = usageData.map(extractUsageData) || []
				fieldsToRemove = ['researchThemes', 'additionalRoles', 'intranetUserData', 'photoConsent']
				break
			case 'buildings':
				url = PUBLIC_EUI_BASE_URL + '/buildings?id=' + slug
				fieldsToRemove = []
				break
			case 'announcements':
				affiliations = clean_entry.euiUnit?.map(extractEntryData) || []
				url = PUBLIC_EUI_INTRANET_BASE_URL + '/announcements?id=' + slug
				fieldsToRemove = ['euiUnit', 'affiliationsGroupsAndCategory']
				break
			case 'servicesProcedures':
				url =
					PUBLIC_EUI_INTRANET_BASE_URL +
					'/services-procedures?cms_servicesProcedures%5Bquery%5D=' +
					clean_entry.entryTitle
				// if(clean_entry.linkToMainTarget?.externalUrl || clean_entry.linkToMainTarget?.internalContent) {
				//     const generatedLink = generateLinkData(clean_entry.linkToMainTarget);
				//     if(generatedLink?.href) url = generatedLink.href;
				// }
				affiliations = clean_entry.affiliations?.map(extractEntryData) || []
				fieldsToRemove = ['euiGroupsAndTeams', 'linkToMainTarget', 'link', 'usefulFor']
				break
			case 'researchProgrammes':
				url = clean_entry.websiteLink ? clean_entry.websiteLink : ''
				themes = clean_entry.researchThemesAreasOfExpertise?.map(extractEntryData) || []
				affiliations = clean_entry.affiliation?.map(extractEntryData) || []
				related_entries =
					clean_entry.programmeLeader?.map((person) =>
						extractEntryData(person, 'Programme Leader')
					) || []
				usage_entries = usageData.map(extractUsageData) || []
				break

			case 'researchThemes':
				url = PUBLIC_EUI_BASE_URL + '/en/public/research/topics?id=' + slug
				usage_entries = usageData.map(extractUsageData) || []
				break
			case 'euiGroupsAndTeams':
				url =
					PUBLIC_EUI_INTRANET_BASE_URL +
					'/people?peopleIntranet%5BrefinementList%5D%5Bcms.groupsAndTeams.entryTitle%5D%5B0%5D=' +
					clean_entry.entryTitle
				usage_entries = usageData.map(extractUsageData) || []
				break
			// case 'pdf':
			//     console.log('pdf entry', clean_entry);
			//     url = uri? uri : "";

			//     break;

			// case 'detailPage':
			// case 'genericPage':
			//in case of genericPage without uri, check if is the homepage of that section
			//extract affiliation from path of the entry, also do for euiIntranetDetail and euiIntranetLanding
			default:
				url = uri
				fieldsToRemove = []
				break
		}

		removeFields(clean_entry, fieldsToRemove)

		//remove null values from themes, affiliations, related_entries and usage_entries
		themes = themes.filter((theme) => theme)
		affiliations = affiliations.filter((affiliation) => affiliation)
		related_entries = related_entries.filter((related) => related)
		usage_entries = usage_entries.filter((usage) => usage)

		return {
			url: url,
			themes: themes,
			thumbnail: thumbnail,
			affiliations: affiliations,
			related_entries: related_entries,
			usage_entries: usage_entries,
			cleaned_entry_data: clean_entry,
			useful_info: useful_info
		}
	} catch (e) {
		console.error(e)
		return {
			url: '',
			themes: [],
			thumbnail: '',
			affiliations: [],
			related_entries: [],
			useful_info: [],
			usage_entries: [],
			cleaned_entry_data: {}
		}
	}
}

export async function getUrlByEntryId(entryId) {
	try {
		const entry = await getContensisDataById(entryId, 0, 'published')
		const { url } = clean_and_organiseEntry(entry)
		return url
	} catch (e) {
		console.error('Error while getting Contensis data:', e.status)
		error(e.status, e.data)
	}
}
