<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';
	import '../app.css';
</script>

<div class="flex h-full flex-col">
	<AppHeader class="sticky top-0 z-20" />

	<main class="flex-1">
		<slot />
	</main>

	<AppFooter />
</div>
