<script>
	import { onMount } from 'svelte'
	import clsx from 'clsx'
	import 'quill/dist/quill.snow.css'

	let {
		editorId = 'canvas-editor',
		htmlContent,
		error = null,
		value = $bindable(),
		label = '',
		toolbar = ['bold', 'italic', 'underline', 'link', 'image', 'video', { list: 'ordered' }, { list: 'bullet' }],
		...rest
	} = $props()

	let quillInstance = $state(null)
	let htmlToRender = $state(htmlContent)

	onMount(async () => {
		const Quill = (await import('quill')).default
		quillInstance = new Quill(`#${editorId}`, {
			modules: {
				toolbar: {
					container: toolbar
				}
			},
			theme: 'snow'
		})

		quillInstance.on('text-change', () => {
			value = quillInstance.getSemanticHTML()
		})

		quillInstance.root.innerHTML = htmlToRender
	})
</script>

<div class={clsx('flex flex-col pb-4', rest.class)}>
	<label for={editorId} class="mb-1 text-sm">{label}</label>

	<div
		class={clsx(
			'relative overflow-hidden rounded border  [&_.ql-container.ql-snow]:border-none [&_.ql-toolbar.ql-snow]:border-l-0 [&_.ql-toolbar.ql-snow]:border-r-0 [&_.ql-toolbar.ql-snow]:border-t-0 [&_.ql-toolbar.ql-snow]:border-intranet-black-300',
			{
				'border-red-600': error,
				'border-intranet-black-300': !error
			}
		)}
	>
		<div class="canvas-editor shadow-none [&_.ql-editor]:min-h-40" id={editorId}></div>
	</div>

	<input type="hidden" name={rest.name} {value} />

	{#if error}
		<small class="absolute -bottom-0 pl-1 pt-1.5 text-xs text-red-600">{error}</small>
	{/if}
</div>
