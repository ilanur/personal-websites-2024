<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client.js'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<div class="container py-12">
	<div class="max-w-prose leading-relaxed">
		<h1>{data.page.title}</h1>
		<div class="canvas-content">{@html data.page.canvas ? getCanvasHTML(data.page.canvas) : 'This page is empty'}</div>
	</div>
</div>
