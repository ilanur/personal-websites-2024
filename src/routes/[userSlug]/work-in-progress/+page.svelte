<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client.js'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<div class="container py-12">
	<h1 class="mb-4 text-3xl">{data.page.title}</h1>
	{@html data.page.canvas ? getCanvasHTML(data.page.canvas) : 'This page is empty'}
</div>
