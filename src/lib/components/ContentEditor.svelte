<script>
	import { onMount } from 'svelte'
	import { ofetch } from 'ofetch'
	import { parseHtml } from '@contensis/html-canvas'
	import clsx from 'clsx'
	import DOMPurify from 'dompurify'
	import Button from '$lib/components/Button.svelte'
	import 'quill/dist/quill.snow.css'

	const { editorId, htmlContent, page, enabled } = $props()

	let editMode = $state(false)
	let saveLoading = $state(false)
	let quillInstance = $state(null)
	let htmlToRender = $state(htmlContent)

	onMount(async () => {
		const Quill = (await import('quill')).default

		quillInstance = new Quill(`#${editorId}`, {
			modules: {
				toolbar: {
					container: ['bold', 'italic', 'underline', 'link', 'image', 'code-block', { list: 'ordered' }, { list: 'bullet' }]
				}
			},
			theme: 'snow'
		})

		quillInstance.root.innerHTML = DOMPurify.sanitize(htmlContent)
	})

	async function onSave() {
		console.log('save', quillInstance.getSemanticHTML())

		try {
			saveLoading = true

			const updatedPage = { ...page }
			const updatedHtml = quillInstance.getSemanticHTML()
			const canvas = await parseHtml(updatedHtml)

			console.log('canvas', canvas)

			for (const item of canvas) {
				if (item.type === '_image' && item.value.asset.sys.uri.startsWith('data:image')) {
					console.log('Upload image')
				}
			}

			updatedPage['canvas'] = canvas

			const response = await ofetch('/api/contensis-entry/update', {
				method: 'PUT',
				body: {
					entry: updatedPage,
					updatedFields: ['canvas']
				}
			})

			console.log('response', response)
			htmlToRender = updatedHtml
		} catch (error) {
			console.error('Error updating page:', error)
		} finally {
			saveLoading = false
			editMode = false
		}
	}
</script>

<div>
	<div
		class={clsx('canvas-content', {
			'relative outline outline-2 outline-offset-8 outline-gray-200 hover:outline-gray-300': enabled,
			hidden: editMode
		})}
	>
		{@html htmlToRender}
		<button
			class="absolute -right-2 -top-2 size-8 bg-gray-200 text-gray-500 hover:bg-gray-300"
			aria-label="Edit section"
			onclick={(editMode = true)}
		>
			<i class="fa-solid fa-pencil"></i>
		</button>
	</div>

	<div class:hidden={!editMode} class="relative">
		<div id={editorId}></div>
		<div class="absolute right-1 top-1 flex gap-x-1">
			<Button class="flex size-8 items-center justify-center border-gray-200 bg-gray-200 !text-gray-500" onclick={() => (editMode = false)}>
				<i class="fa-solid fa-xmark"></i>
			</Button>
			<Button class="flex size-8 items-center justify-center" loading={saveLoading} onclick={onSave}>
				<i class="fa-solid fa-floppy-disk"></i>
			</Button>
		</div>
	</div>
</div>
