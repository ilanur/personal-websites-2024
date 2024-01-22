<script>
	/** @type {import('./$types').PageData} */
	export let data;
    let entry = data.entry;
</script>
  
<h1>{entry.entryTitle}</h1>
<div>{@html entry.entryDescription}</div>