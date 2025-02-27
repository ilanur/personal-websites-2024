<script>
	import { onMount } from 'svelte'
	import { parseHtml } from '@contensis/html-canvas'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import { canvasToText, getCanvasHTML } from '$lib/utils/contensis/client'
	import clsx from 'clsx'
	import Button from '$lib/components/Button.svelte'
	import BaseModal from '$lib/components/BaseModal.svelte'
	import 'quill/dist/quill.snow.css'

	let {
		editorId = 'canvas-editor',
		htmlContent,
		enabled = false,
		toolbar = ['bold', 'italic', 'underline', 'link', 'image', 'video', { list: 'ordered' }, { list: 'bullet' }],
		returnType = 'canvas', // canvas, html, text
		onSave,
		...rest
	} = $props()

	let editMode = $state(false)
	let saveLoading = $state(false)
	let quillInstance = $state(null)
	let htmlToRender = $state(htmlContent.replace(/&nbsp;/g, ' '))
	let cancelModalRef = $state()
	let clickedSave = $state(false)
	let canvasContentRef = $state(null)
	let contentHasChanged = $state(false)

	const hasNoContent = $derived(!htmlToRender || htmlToRender === '<p></p>')

	$effect(() => {
		if (htmlContent !== htmlToRender && !clickedSave) {
			setInnerHTML(htmlContent)
			clickedSave = false
		}
	})

	onMount(async () => {
		await initQuill()
		await imageLoader()
		await videoLoader()
	})

	async function initQuill() {
		if (!quillInstance) {
			const Quill = (await import('quill')).default

			quillInstance = new Quill(`#${editorId}`, {
				modules: {
					toolbar: {
						container: toolbar
					}
				},
				theme: 'snow'
			})
		}

		setInnerHTML(htmlToRender)

		quillInstance.on('text-change', () => {
			if (editMode) {
				contentHasChanged = true
			}
		})
	}

	function setInnerHTML(html) {
		if (quillInstance) {
			quillInstance.root.innerHTML = html.replace(/&nbsp;/g, ' ')
		}
		htmlToRender = html.replace(/&nbsp;/g, ' ')
	}

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

			resolve()
		})

		if (mappedCanvas) {
			htmlToRender = getCanvasHTML(mappedCanvas)
		}
	}

	async function videoLoader() {
		const youtubeLinks = canvasContentRef.querySelectorAll('a[href*="youtube.com/embed/"]')

		youtubeLinks.forEach((link) => {
			const url = link.getAttribute('href')
			const iframe = document.createElement('iframe')

			iframe.src = url
			iframe.width = '100%'
			iframe.height = ''
			iframe.style.aspectRatio = '16 / 9'
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
			iframe.allowFullscreen = true

			link.parentNode.replaceChild(iframe, link)
		})
	}

	function onEditClick() {
		editMode = true
		quillInstance.root.innerHTML = htmlToRender
	}

	async function onSaveClick() {
		try {
			saveLoading = true
			clickedSave = true

			const updatedHtml = quillInstance.getSemanticHTML()
			const canvas = await parseHtml(updatedHtml)

			if (returnType === 'canvas') {
				await onSave(canvas)
			}

			if (returnType === 'html') {
				await onSave(updatedHtml)
			}

			if (returnType === 'text') {
				await onSave(canvasToText(canvas))
			}

			setInnerHTML(updatedHtml)
		} catch (error) {
			console.error('Error updating page:', error)
		} finally {
			saveLoading = false
			editMode = false
		}
	}

	function onCancelClick() {
		if (contentHasChanged) {
			cancelModalRef.openModal()
		} else {
			editMode = false
		}
	}

	function onModalNoClick() {
		cancelModalRef.closeModal()
	}

	function onModalYesClick() {
		cancelModalRef.closeModal()
		editMode = false
	}
</script>

<div class={rest.class}>
	<div
		bind:this={canvasContentRef}
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

		{#if enabled}
			<button
				class={clsx('absolute -right-10 -top-2 size-8 bg-gray-200 text-gray-500 hover:bg-gray-300')}
				aria-label="Edit section"
				onclick={onEditClick}
			>
				<i class="fa-solid fa-pencil"></i>
			</button>
		{/if}
	</div>

	<div class:hidden={!editMode} class="relative bg-white text-intranet-black-950">
		<div id={editorId}></div>
		<div class="absolute right-1 top-1 flex gap-x-1">
			<Button class="flex size-8 items-center justify-center border-gray-200 bg-gray-200 !text-gray-500" onclick={onCancelClick}>
				<i class="fa-solid fa-xmark"></i>
			</Button>
			<Button class="flex size-8 items-center justify-center" loading={saveLoading} onclick={onSaveClick}>
				<i class="fa-solid fa-floppy-disk"></i>
			</Button>
		</div>
	</div>
</div>

<BaseModal bind:this={cancelModalRef}>
	{#snippet headerSlot()}
		Cancel editing
	{/snippet}

	<p>Are you sure you want to cancel editing?</p>
	<p>All changes will be lost</p>

	{#snippet footerSlot()}
		<div class="flex justify-end gap-3">
			<Button class="!px-3 !py-0.5" outlined onclick={onModalNoClick}>No</Button>
			<Button class="!px-3 !py-0.5" onclick={onModalYesClick}>Yes</Button>
		</div>
	{/snippet}
</BaseModal>
