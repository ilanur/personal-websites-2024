<script>
	export let data;
	$: result = data.result;
</script>

<h1>{result.title}</h1>
