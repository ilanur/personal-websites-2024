<script>
	import { onMount } from 'svelte'
	import { parseHtml } from '@contensis/html-canvas'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import { getCanvasHTML } from '$lib/utils/contensis/client'
	import clsx from 'clsx'
	import Button from '$lib/components/Button.svelte'
	import 'quill/dist/quill.snow.css'

	const { editorId = 'canvas-editor', htmlContent, enabled = false, onSave } = $props()

	let editMode = $state(false)
	let saveLoading = $state(false)
	let quillInstance = $state(null)
	let htmlToRender = $state(htmlContent)

	const hasNoContent = $derived(!htmlToRender || htmlToRender === '<p></p>')

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
		quillInstance.root.innerHTML = htmlToRender
		imageLoader()
	})

	async function imageLoader() {
		const canvas = await parseHtml(htmlToRender)
		let mappedCanvas

		await new Promise((resolve) => {
			const mapped = canvas.map((item) => {
				if (item.type === '_image' && item.value.asset.sys.uri.startsWith(`${PUBLIC_EUI_WEB}/Content-Types-Assets`)) {
					const img = new Image()

					img.src = item.value.asset.sys.uri

					img.onerror = () => {
						item.value.asset.sys.uri = `${PUBLIC_EUI_WEB}/web-production/code/assets/img/image-processing.jpg`
						resolve()
					}
				}

				return item
			})

			mappedCanvas = mapped
		})

		if (mappedCanvas) {
			htmlToRender = getCanvasHTML(mappedCanvas)
		}
	}

	function onEditClick() {
		editMode = true
		quillInstance.root.innerHTML = htmlToRender
	}

	async function onSaveClick() {
		try {
			saveLoading = true

			const updatedHtml = quillInstance.getSemanticHTML()
			const canvas = await parseHtml(updatedHtml)

			await onSave(canvas)

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
		{#if hasNoContent}
			Add content
		{:else}
			{@html htmlToRender}
		{/if}

		<button
			class={clsx('absolute -right-2 -top-2 size-10 bg-gray-200 text-gray-500 hover:bg-gray-300')}
			aria-label="Edit section"
			onclick={onEditClick}
		>
			<i class="fa-solid fa-pencil"></i>
		</button>
	</div>

	<div class:hidden={!editMode} class="relative bg-white text-intranet-black-950">
		<div id={editorId}></div>
		<div class="absolute right-1 top-1 flex gap-x-1">
			<Button class="flex size-8 items-center justify-center border-gray-200 bg-gray-200 !text-gray-500" onclick={() => (editMode = false)}>
				<i class="fa-solid fa-xmark"></i>
			</Button>
			<Button class="flex size-8 items-center justify-center" loading={saveLoading} onclick={onSaveClick}>
				<i class="fa-solid fa-floppy-disk"></i>
			</Button>
		</div>
	</div>
</div>
