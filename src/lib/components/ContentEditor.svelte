<script>
	import { onMount } from 'svelte'
	import { ofetch } from 'ofetch'
	import { parseHtml } from '@contensis/html-canvas'
	import { base64toFile } from '$lib/utils/utils'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import { getCanvasHTML } from '$lib/utils/contensis/client'
	import clsx from 'clsx'
	import Button from '$lib/components/Button.svelte'
	import 'quill/dist/quill.snow.css'

	const { editorId, htmlContent, page, enabled, assetUploadFolder } = $props()

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

		quillInstance.root.innerHTML = htmlToRender

		imageLoader()
	})

	$effect(async () => {})

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

	async function onSave() {
		try {
			saveLoading = true

			const updatedPage = { ...page }
			const updatedHtml = quillInstance.getSemanticHTML()
			const canvas = await parseHtml(updatedHtml)

			for (const item of canvas) {
				if (item.type === '_image' && item.value.asset.sys.uri.startsWith('data:image')) {
					const uploadedUrl = await uploadImage(item.value.asset.sys.uri)
					item.value.asset.sys.uri = uploadedUrl
				}
			}

			updatedPage['canvas'] = canvas

			await ofetch('/api/contensis/entries/update', {
				method: 'PUT',
				body: {
					entry: updatedPage,
					updatedFields: ['canvas']
				}
			})

			htmlToRender = updatedHtml
		} catch (error) {
			console.error('Error updating page:', error)
		} finally {
			saveLoading = false
			editMode = false
		}
	}

	async function uploadImage(localUrl) {
		const file = base64toFile(localUrl)

		const formData = new FormData()
		formData.append('image', file, file.name)
		formData.append('folder', assetUploadFolder)

		const response = await ofetch('/api/contensis/assets/upload', {
			method: 'POST',
			body: formData
		})

		return `${PUBLIC_EUI_WEB}${response.uploadedPhoto.sys.uri}`
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
		<button class="absolute -right-2 -top-2 size-8 bg-gray-200 text-gray-500 hover:bg-gray-300" aria-label="Edit section" onclick={onEditClick}>
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
