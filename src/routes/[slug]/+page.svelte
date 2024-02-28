<script>
	import Landing from '$lib/components/Landing.svelte';
	import Detail from '$lib/components/Detail.svelte';
	export let data;
	$: result = data.result;
</script>

<h1>{result.title}</h1>

