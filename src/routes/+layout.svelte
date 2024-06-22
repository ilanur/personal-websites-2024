<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';
	import '../app.css';
</script>

<AppHeader class="sticky top-0 z-30" />

<div class="flex h-full flex-col">
	<main class="flex-1">
		<slot />
	</main>

	<AppFooter />
</div>
