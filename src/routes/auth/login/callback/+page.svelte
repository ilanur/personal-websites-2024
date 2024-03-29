<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { createDirectus, authentication } from '@directus/sdk';
	import { getCurrentUser } from '$lib/utils/directus';

	let user = null;

	onMount(async () => {
		try {
			const client = createDirectus(PUBLIC_DIRECTUS_API_URL).with(
				authentication('session', { credentials: 'include' })
			);
			const { token } = await client.refresh();
			console.log('token', token);
			//now it should be logged in the session
			user = await getCurrentUser();
		} catch (error) {
			console.log(error);
		}
	});
</script>

{#if user != null}
	<h1>Welcome, {user.first_name} {user.last_name}</h1>
{:else}
	<h1>Logging in...</h1>
{/if}
