import OpenAI from 'openai'
import { json } from '@sveltejs/kit'
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients.js'

// Initialize the OpenAI client
const openai = new OpenAI({
	apiKey: PRIVATE_OPENAI_API_KEY
})

export const POST = async ({ request }) => {
	const { userInput, user, entryPayload, urlContext, entryId } = await request.json()
	const cleanEntryPayload = { ...entryPayload }

	// Clean the entry payload
	for (const key in cleanEntryPayload) {
		if (
			typeof cleanEntryPayload[key] === 'object' &&
			cleanEntryPayload[key] !== null &&
			!Array.isArray(cleanEntryPayload[key])
		) {
			const subObject = cleanEntryPayload[key]
			cleanEntryPayload[key] = {
				sys: subObject.sys,
				entryTitle: subObject.entryTitle,
				entryDescription: subObject.entryDescription
			}
		}
	}

	// Remove unnecessary fields
	delete cleanEntryPayload.entryTitle
	delete cleanEntryPayload.entryDescription
	delete cleanEntryPayload.entryThumbnail
	delete cleanEntryPayload.sys

	console.log('cleanEntryPayload:', cleanEntryPayload)
	const system_prompt = `You are an AI assistant specialized in website content editing and optimization. Your task is to guide the user in updating or refining their current page with clarity and precision.

Understand the User's Intent, which could involve:

-Updating or rewriting any section of the page.
-Retrieving user-specific data for personalization.
-Enhancing text for readability, clarity, or SEO, adding lists, bolds or heading tags in fields that support HTML.
-Providing suggestions for academic and professional tone improvements.

Execute Updates based on the user's input:

-You do not reply, you can just execute the functions when needed.
-Include only the fields specified by the user with their correct structure.
-Maintain the integrity of sub-objects (sys properties) within the entryPayload; do not edit or modify these fields.
-Never edit the following fields: entryTitle, entryDescription, entryThumbnail. 
-Style & Tone: Ensure the resulting text is clear, concise, professional, and aligned with an academic style.
`

	const context = `{ userInput: "${userInput}", user: "${user}", entryId: "${entryId}", entryPayload: ${JSON.stringify(cleanEntryPayload)}, urlContext: ${JSON.stringify(urlContext)}}`

	// Define functions with the correct structure
	const tools = [
		{
			type: 'function',
			function: {
				name: 'update_entry', // Simplified function name
				description: 'Update a Contensis entry with new information.',
				parameters: {
					type: 'object',
					properties: {
						editedPayload: {
							type: 'string',
							description: 'The JSON payload object containing the updated entry information.'
						}
					},
					required: ['editedPayload'],
					additionalProperties: false
				}
			}
		},
		{
			type: 'function',
			function: {
				name: 'get_user', // Simplified function name
				description: 'Retrieve data of the current user if needed.',
				parameters: {
					type: 'object',
					properties: {},
					additionalProperties: false
				}
			}
		}
	]

	try {
		let messages = [
			{
				role: 'system',
				content: system_prompt
			},
			{
				role: 'user',
				content: context
			}
		]

		let completion
		let reloadPage = false

		while (true) {
			completion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: messages,
				tools: tools,
				tool_choice: 'auto'
			})

			const { message } = completion.choices[0]
			messages.push(message)

			if (message.tool_calls) {
				for (const toolCall of message.tool_calls) {
					const functionName = toolCall.function.name
					const args = JSON.parse(toolCall.function.arguments)
					let functionResponse

					if (functionName === 'update_entry') {
						functionResponse = await handleUpdateContensisEntry(args, entryPayload, entryId)
						reloadPage = true
					} else if (functionName === 'get_user') {
						functionResponse = await handleRetrieveUserData(user)
					} else {
						functionResponse = { error: 'Unknown function called' }
					}

					messages.push({
						role: 'tool',
						tool_call_id: toolCall.id,
						content: JSON.stringify(functionResponse)
					})
				}
			} else {
				break
			}
		}

		return json({ success: true, completion, reload_page: reloadPage }, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return json({ error: 'An error occurred while processing your request' }, { status: 500 })
	}
}

// Function to handle updating the Contensis entry
async function handleUpdateContensisEntry(args, entryPayload, entryId) {
	const { editedPayload } = args

	console.log('Updating entry ' + entryId + ' with editedPayload:', editedPayload)

	// Convert editedPayload to object
	let updatedEntryPayload = {}
	try {
		updatedEntryPayload = JSON.parse(editedPayload)
	} catch (error) {
		console.error('Error parsing editedPayload:', error)
		return { error: 'An error occurred while parsing the edited payload' }
	}

	// Update the entryPayload with the new payload
	const newEntryPayload = { ...entryPayload, ...updatedEntryPayload }

	try {
		const updatedEntry = await ManagementClient.entries.update(newEntryPayload)

		if (updatedEntry.sys.workflow.state !== 'versionComplete') {
			await ManagementClient.entries.invokeWorkflow(updatedEntry, 'draft.publish')
		}

		return { result: 'Entry updated successfully' }
	} catch (error) {
		console.error('Error updating entry:', error)
		return { error: 'An error occurred while updating the entry' }
	}
}

// Function to handle retrieving user data
async function handleRetrieveUserData(user) {
	console.log('Retrieving user data for user:', user)

	try {
		// Fetch user data using the DeliveryClient
		let userData = await DeliveryClient.entries.search(
			{
				where: [
					{ field: 'sys.contentTypeId', equalTo: 'people' },
					{ field: 'sys.versionStatus', equalTo: 'published' },
					{ field: 'euiEmail', equalTo: user.email }
				]
			},
			1
		)

		// Get only the first item
		userData = userData.items.length ? userData.items[0] : null

		// Return the user data
		console.log('User data retrieved:', userData)
		return { userData }
	} catch (error) {
		console.error('Error retrieving user data:', error)
		return { error: 'An error occurred while retrieving user data' }
	}
}
