<script>
	import { getContext } from 'svelte'

	export let data

	const smallHeroBanner = getContext('smallHeroBanner')
	smallHeroBanner.set(true)
</script>

<div class="container py-12">
	<h1 class="mb-5 font-normal">{data.page.title}</h1>
	{@html data.page.content}
</div>
