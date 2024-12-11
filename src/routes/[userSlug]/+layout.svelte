<script>
	import PagesLayout from '$lib/components/layouts/PagesLayout.svelte'
	import { page } from '$app/stores'

	let { data, children } = $props()

	let route = $derived($page.route.id)
	let hasSidebar = $derived(route.includes('/[userSlug]/blog') || route.includes('/[userSlug]/settings') ? false : true)
</script>

<PagesLayout {data} {hasSidebar}>
	{@render children?.()}
</PagesLayout>
