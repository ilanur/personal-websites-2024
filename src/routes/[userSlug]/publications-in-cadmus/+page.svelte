<script>
	import { getContext } from 'svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')
	$smallHeroBanner = true
</script>

<div class="container py-12">
	<h2 class="mb-5 font-normal">{data.page.title}</h2>
	{@html data.page.content ?? 'This page is empty'}
</div>
