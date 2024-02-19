<script>
	//intranet landings
	import AutomaticListings from '$lib/components/composerLanding/automaticListings.svelte';
	import HeaderImageLinks from '$lib/components/composerLanding/headerImageLinks.svelte';
	import QuickLinks from '$lib/components/composerLanding/quickLinks.svelte';
	import HorizontalSearch from '$lib/components/HorizontalSearch.svelte';

	//import { page } from '$app/stores';
	export let entry;
	//let entry = $page.data.entry;
	console.log('entry:', entry);
	function getComponentLanding(type) {
		switch (type) {
			case 'automaticListings':
				return AutomaticListings;
			case 'headerImageLinks':
				return HeaderImageLinks;
			case 'quickLinks':
				return QuickLinks;
			case 'horizontalSearch':
				return HorizontalSearch;
			default:
				return null;
		}
	}
</script>

<!--
<h1>{entry.entryTitle}</h1>
<div>{@html entry.entryDescription}</div>
-->
{#if entry.headerComposer}
	{#each entry.headerComposer as item}
		{#if getComponentLanding(item.type)}
			<svelte:component this={getComponentLanding(item.type)} item={item.value} title={entry.entryTitle} />
		{/if}
	{/each}
{/if}
{#if entry.bodyComposer}
	{#each entry.bodyComposer as item}
		{#if getComponentLanding(item.type)}
			<svelte:component this={getComponentLanding(item.type)} item={item.value} />
		{/if}
	{/each}
{/if}
