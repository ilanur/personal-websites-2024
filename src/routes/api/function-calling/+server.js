import OpenAI from 'openai'
import { json } from '@sveltejs/kit'
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients.js'

//TODO: Add error handling for when the user does not have permission to update the entry
//TODO: add function to retrieve userData and add it to the context if the AI needs to know any user-specific information

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
	const system_prompt = `You are an AI assistant specialized in website content editing and optimization. Your task is to guide the user in updating or refining their current page with clarity and precision.

Understand the User's Intent: The user's request could involve:

Updating or rewriting any section of the page.
Enhancing text for readability, clarity, or SEO.
Providing suggestions for academic and professional tone improvements.
Execute Updates: Based on the user’s input:

You do not reply, you can just execute the update_contensis_entry.
Include only the fields specified by the user with their correct structure.
Maintain the integrity of sub-objects (sys properties) within the entryPayload; do not edit or modify these fields.
Avoid editing the standard fields: entryTitle, entryDescription, and entryThumbnail. These are references to other fields and may have different names based on the content type.
Style & Tone: Ensure the resulting text is clear, concise, professional, and aligned with an academic style.
`

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
