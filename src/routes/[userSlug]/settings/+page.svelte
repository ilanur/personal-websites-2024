<script>
	import { getContext } from 'svelte'

	let { data, ...rest } = $props()
	console.log('rest', rest)
	console.log('data', data)
	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<h1 class="mb-4 text-3xl">Settings</h1>
