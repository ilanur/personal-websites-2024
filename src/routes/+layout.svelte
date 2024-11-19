<script>
	import AppHeader from '$lib/components/AppHeader.svelte'
	import AppFooter from '$lib/components/AppFooter.svelte'
	import '../app.css'

	let { children } = $props()
</script>

<div class="flex min-h-screen flex-col">
	<AppHeader class="sticky top-0 z-30" />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<AppFooter />
</div>
