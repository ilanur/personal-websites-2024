import OpenAI from 'openai'
import { json } from '@sveltejs/kit'
import { PRIVATE_OPENAI_API_KEY } from '$env/static/private'
import { DeliveryClient, ManagementClient } from '$lib/utils/contensis-clients.js'

const openai = new OpenAI({
	apiKey: PRIVATE_OPENAI_API_KEY
})

export const POST = async ({ request }) => {
	const { userInput, entryId } = await request.json()

	const functions = [
		{
			type: 'function',
			function: {
				name: 'update_contensis_entry',
				description: 'Update a Contensis entry with new information.',
				parameters: {
					type: 'object',
					properties: {
						title: {
							type: 'string',
							description: 'The updated title (or name) for the entry.'
						},
						description: {
							type: 'string',
							description: 'The updated description for the entry.'
						},
						entryId: {
							type: 'string',
							description: `The ID of the Contensis entry is ${entryId}`
						}
					},
					required: [entryId],
					additionalProperties: false
				}
			}
		}
	]

	try {
		let completion
		let reloadPage = false

		completion = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [{ role: 'user', content: userInput }],
			tools: functions,
			tool_choice: 'auto'
		})

		const { message } = completion.choices[0]

		if (message.tool_calls) {
			const functionName = message.tool_calls[0].function.name

			if (functionName === 'update_contensis_entry') {
				const args = JSON.parse(message.tool_calls[0].function.arguments)
				const { title, description } = args

				const contensisEntry = await DeliveryClient.entries.get(entryId)

				contensisEntry.title = title
				contensisEntry.description = description

				const updatedEntry = await ManagementClient.entries.update(contensisEntry)

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
