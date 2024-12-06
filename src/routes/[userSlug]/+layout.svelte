<script>
	import PagesLayout from '$lib/components/PagesLayout.svelte'
	import { page } from '$app/stores'

	let { data, children } = $props()

	let route = $derived.by(() => $page.route.id)
	let hasSidebar = $derived(route.includes('/[userSlug]/blog') || route.includes('/[userSlug]/settings') ? false : true)
</script>

<PagesLayout {data} {hasSidebar}>
	{@render children?.()}
</PagesLayout>
