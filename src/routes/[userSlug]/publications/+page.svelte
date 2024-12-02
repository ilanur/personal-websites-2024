<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client.js'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<div class="container py-12">
	<h2 class="mb-5 font-normal">{data.page.title}</h2>
	{@html data.page.canvas ? getCanvasHTML(data.page.canvas) : 'This page is empty'}
</div>
