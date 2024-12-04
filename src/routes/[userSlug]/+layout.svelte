<script>
	import SharedLayoutWithSidebar from '$lib/components/SharedLayoutWithSidebar.svelte'
	let { data, children } = $props()
</script>

<SharedLayoutWithSidebar {data}>
	{@render children?.()}
</SharedLayoutWithSidebar>
