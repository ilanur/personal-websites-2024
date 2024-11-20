<script>
	import clsx from 'clsx'
	import Button from './Button.svelte'
	import { ofetch } from 'ofetch/node'

	let { ...rest } = $props()

	let value = $state('')

	async function callFunction() {
		const response = await ofetch('/api/function-calling', {
			method: 'POST',
			body: {
				promptValue: value
			}
		})

		console.log('response', response)
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

	<Button onclick={callFunction}>Submit</Button>
</div>
