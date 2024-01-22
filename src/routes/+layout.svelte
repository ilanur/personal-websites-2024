<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';

	export let data;
</script>

<Navigation isLoggedIn={!!data.session} />

<div class="c-content">
	<slot />
</div>

<style>
	.c-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem 0;
	}
</style>
