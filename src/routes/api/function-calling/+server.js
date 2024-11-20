import OpenAI from 'openai'
import { json } from '@sveltejs/kit'
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients.js'

const openai = new OpenAI({
	apiKey: PRIVATE_OPENAI_API_KEY
})

export const POST = async ({ request }) => {
	const { userInput, user, entryPayload, urlContext, entryId } = await request.json()
	const cleanEntryPayload = { ...entryPayload }

	// Remove almost all fields from sub-objects in the entry payload
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

	//remove entryTitle, entryDescription, and entryThumbnail from the root level to avoid confusion editing them
	delete cleanEntryPayload.entryTitle
	delete cleanEntryPayload.entryDescription
	delete cleanEntryPayload.entryThumbnail
	delete cleanEntryPayload.sys

	console.log('cleanEntryPayload:', cleanEntryPayload)
	const system_prompt = `You assist the user in the editing of his/her personal website. 
	You understand the intent of the user which can be any update inside the page, or help in writing content, title, optimising any text, and you execute the function to update the entry, generating the correct payload containing the edits, and including only the fields edited, with their correct structure. You choose the fields based on the user input. You never edit any of the sub-objects of the entryPayload (the ones with a sys property not in the root level), you can only edit the current entry. 
	The fields: entryTitle, entryDescription, and entryThumbnail are standard fields that cannot be edited, they are references to the entry's title, description, and thumbnail, which field name could be different depending on the content type.
	The style should be academic and professional, and text should be clear and concise.`

	const context = `{ userInput: "${userInput}", user: "${user}", entryId: "${entryId}", entryPayload: ${JSON.stringify(cleanEntryPayload)}, urlContext: ${JSON.stringify(urlContext)}}`

	const functions = [
		{
			type: 'function',
			function: {
				name: 'update_contensis_entry',
				description: 'Update a Contensis entry with new information.',
				parameters: {
					type: 'object',
					properties: {
						editedPayload: {
							type: 'string',
							description: 'The JSON payload object containing the updated entry information.'
						}
					},
					additionalProperties: false
				}
			}
		}
	]

	try {
		let completion
		let reloadPage = false

		completion = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: system_prompt
				},
				{
					role: 'user',
					content: context
				}
			],
			tools: functions,
			tool_choice: 'auto'
		})

		const { message } = completion.choices[0]

		if (message.tool_calls) {
			const functionName = message.tool_calls[0].function.name

			if (functionName === 'update_contensis_entry') {
				const args = JSON.parse(message.tool_calls[0].function.arguments)
				const { editedPayload } = args

				console.log('Updating entry ' + entryId + ' with editedPayload:', editedPayload)

				//convert editedPayload to object and if fails return error
				let updatedEntryPayload = {}
				try {
					updatedEntryPayload = JSON.parse(editedPayload)
				} catch (error) {
					console.error('Error parsing editedPayload:', error)
					return json(
						{ error: 'An error occurred while parsing the edited payload' },
						{ status: 500 }
					)
				}

				// Update the entryPayload with the new payload
				const newEntryPayload = { ...entryPayload, ...updatedEntryPayload }

				const updatedEntry = await ManagementClient.entries.update(newEntryPayload)

				if (updatedEntry.sys.workflow.state !== 'versionComplete') {
					await ManagementClient.entries.invokeWorkflow(updatedEntry, 'draft.publish')
				}

				reloadPage = true
			}
		}

		return json({ success: true, completion, reload_page: reloadPage }, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return json({ error: 'An error occurred while processing your request' }, { status: 500 })
	}
}
