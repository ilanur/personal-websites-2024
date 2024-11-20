<script>
	import clsx from 'clsx'
	import Button from './Button.svelte'
	import { ofetch } from 'ofetch/node'

	let { ...rest } = $props()

	let value = $state('')
	let loading = $state(false)

	async function callFunction() {
		loading = true

		try {
			const response = await ofetch('/api/function-calling', {
				method: 'POST',
				body: {
					userInput: value,
					entryId: '610b1862-d956-4a1a-909e-404cb5fd8934'
				}
			})

			console.log('response', response)

			if (response.reload_page) {
				window.location.reload()
			}
		} catch (error) {
			console.error(error)
		} finally {
			loading = false
		}
	}
</script>

<div
	class={clsx(
		'flex flex-col items-end rounded-md border border-eui-gray-10 bg-white p-4 shadow-md',
		rest.class
	)}
>
	<textarea
		bind:value
		name="functionCallingPrompt"
		id="functionCallingPrompt"
		class="mb-4 h-40 w-80 resize-none rounded-md border-2 border-eui-gray-30"
	></textarea>

	<Button onclick={callFunction} {loading}>Submit</Button>
</div>
