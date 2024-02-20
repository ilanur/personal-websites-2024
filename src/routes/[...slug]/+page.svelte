<script>
	import Landing from '$lib/components/Landing.svelte';
	import Detail from '$lib/components/Detail.svelte';
	export let data;
	//$: entry = data.entry;
	//entry = data.entry;

	//console.log(entry.sys.contentTypeId);
	$: entry = data.entry;
	$: if (entry.sys.contentTypeId == 'departmentsServices') {
		entry = entry.intranetPageContent;
	}
</script>
<h1>{entry.entryTitle}</h1>
{#if entry.sys.contentTypeId === 'euiIntranetLanding'}
	<Landing {entry} />
{:else if entry.sys.contentTypeId === 'euiIntranetDetail'}
	<Detail {entry} />
{:else}
	<h1>{entry.entryTitle}</h1>
{/if}
