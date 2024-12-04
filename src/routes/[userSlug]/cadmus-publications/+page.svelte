<script>
	import { getContext } from 'svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<h1 class="mb-4 text-3xl">Publications in Cadmus</h1>
{#each data.publications as pub}
	<div class="mb-6 rounded-lg border p-4 shadow-md">
		<h2 class="mb-2 text-xl font-bold">
			<a href={pub.uri} target="_blank" rel="noopener" class="hover:underline">{pub.title}</a>
		</h2>
		{#if pub.authors.length > 0}
			<p class="mb-1 text-sm text-gray-700"><strong>Authors:</strong> {pub.authors.join(', ')}</p>
		{/if}
		{#if pub.editors.length > 0}
			<p class="mb-1 text-sm text-gray-700"><strong>Editors:</strong> {pub.editors.join(', ')}</p>
		{/if}
		{#if pub.others.length > 0}
			<p class="mb-1 text-sm text-gray-700"><strong>Others:</strong> {pub.others.join(', ')}</p>
		{/if}
		<p class="mb-1 text-sm text-gray-700"><strong>Date:</strong> {pub.date}</p>
		<p class="mb-1 text-sm text-gray-700"><strong>Type:</strong> {pub.type}</p>
	</div>
{/each}

<a
	href="https://cadmus.eui.eu/browse?type=author&authority={data.uniqueIdentityCode}"
	target="_blank"
	rel="noopener"
	class="btn mt-4 inline-block hover:underline">View all publications</a
>
