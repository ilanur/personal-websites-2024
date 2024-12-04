<script>
	import { getContext } from 'svelte'
	import { getCanvasHTML } from '$lib/utils/contensis/client'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = false
</script>

{#if data.page}
	<h1 class="mb-4 text-3xl">{data.page.title}</h1>
	<div class="canvas-content">{@html data.page.canvas ? getCanvasHTML(data.page.canvas) : 'This page is empty'}</div>
{/if}
