<script>
	import { onMount } from 'svelte'
	import 'quill/dist/quill.snow.css'
	import clsx from 'clsx'

	let {
		editorId = 'canvas-editor',
		htmlContent,
		value = $bindable(),
		label = '',
		toolbar = ['bold', 'italic', 'underline', 'link', 'image', 'code-block', { list: 'ordered' }, { list: 'bullet' }],
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

<div class={clsx('flex h-40 flex-col', rest.class)}>
	<label for={editorId} class="mb-1 text-sm" onclick={quillInstance.focus()}>{label}</label>
	<div class="canvas-editor" id={editorId}></div>
	<input type="hidden" name={rest.name} {value} />
</div>
