<script>
	import clsx from 'clsx'
	import Button from './Button.svelte'
	import { ofetch } from 'ofetch/node'
	import { page } from '$app/stores'

	// Local state
	let showTutorial = $state(true)
	let editorContent = $state('')
	let showEditPreview = $state(false)
	let loading = $state(false)
	let isExpanded = $state(false)
	let showEditor = $state(false)

	const authUser = $derived($page.data.authUser)
	const currentEntryId = $derived($page.data.page?.sys?.id)

	if ($page.data.personalWebsite.people.euiEmail == authUser.email) {
		if (currentEntryId) {
			showEditor = true
		}
	}

	// Actions
	const quickActions = ['Optimize SEO', 'Correct grammar', 'Improve structure']

	function hideTutorial() {
		showTutorial = false
	}

	function handleEditorChange(event) {
		const target = event.target
		editorContent = target.value
	}

	async function callFunction() {
		loading = true

		try {
			const response = await ofetch('/api/function-calling', {
				method: 'POST',
				body: {
					userInput: editorContent,
					user: authUser,
					entryPayload: $page.data.page,
					urlContext: $page.data.url,
					entryId: currentEntryId
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

	function toggleExpansion() {
		console.log('toggleExpansion')
		isExpanded = !isExpanded
	}
</script>

{#if showEditor}}
	<div class="fixed bottom-6 right-6 rounded-lg">
		{#if isExpanded}
			<div class="mx-auto max-w-4xl space-y-4 border bg-white p-4">
				{#if showTutorial}
					<div class="bg-blue-50 border-blue-200 mb-4 p-4">
						<div class="flex items-center space-x-2">
							<div class="bg-blue-500 h-4 w-4 rounded-full"></div>
							<div class="space-y-2">
								<h3 class="font-semibold">Welcome to the Editor Assistant</h3>
								<ul class="list-disc space-y-1 pl-4">
									<li>Write the text or describe what you want to do</li>
									<li>The assistant will automatically understand your intentions</li>
									<li>You will see a preview of the highlighted changes</li>
									<li>Confirm to publish</li>
								</ul>
								<button on:click={hideTutorial} class="text-blue-600 hover:text-blue-800 text-sm">
									Got it, don't show again
								</button>
							</div>
						</div>
					</div>
				{/if}

				<div class="p-4">
					<div class="mb-4 border-b pb-2">
						<div class="text-gray-500 flex items-center space-x-2 text-sm">
							<div class="bg-gray-500 h-4 w-4 rounded-full"></div>
							<span>Write or describe what you want to modify...</span>
						</div>
					</div>

					<textarea
						class="h-32 w-full rounded border p-2"
						placeholder="E.g.: Add a product image after the first paragraph
	or
	Make this text more concise while keeping the key points"
						bind:value={editorContent}
						on:input={handleEditorChange}
					/>
					<Button onclick={callFunction} {loading}>Submit</Button>
				</div>

				{#if showEditPreview}
					<div class=" bg-white p-4">
						<div class="mb-4 flex items-center justify-between">
							<h3 class="font-semibold">Preview changes</h3>
							<div class="flex space-x-2">
								<button class="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
									<div class="bg-gray-600 h-4 w-4 rounded-full"></div>
									<span>History</span>
								</button>
								<button
									class="bg-green-600 hover:bg-green-700 flex items-center space-x-1 rounded-md px-3 py-1 text-white"
								>
									<div class="h-4 w-4 rounded-full bg-white"></div>
									<span>Confirm</span>
								</button>
							</div>
						</div>
						<div class="prose max-w-none">
							<div class="border-blue-400 border-l-4 pl-4">
								<p>Modified content...</p>
							</div>
						</div>
					</div>
				{/if}

				<div class="grid grid-cols-3 gap-4">
					{#each quickActions as action}
						<button
							class="hover:bg-gray-30 flex items-center justify-center space-x-1 rounded-lg border p-1"
						>
							<span>{action}</span>
							<div class="bg-gray-500 h-3 w-3"></div>
						</button>
					{/each}
				</div>
			</div>
		{/if}
		<button
			on:click={toggleExpansion}
			class="hover:bg-blue-700 fixed bottom-6 right-6 rounded-full bg-eui-blue px-4 py-2 font-bold text-white shadow-lg"
		>
			{#if isExpanded}
				X
			{:else}
				Open Assistant
			{/if}
		</button>
	</div>
{/if}
