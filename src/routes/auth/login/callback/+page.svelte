<script>
	import { PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
	import { createDirectus, authentication, rest, login, refresh, readMe } from '@directus/sdk';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	export let user = null;
	onMount(async () => {
  
        const client = createDirectus(PUBLIC_DIRECTUS_API_URL)
        .with(authentication("cookie", { credentials: "include" }))
        .with(rest());
        console.log("client", client)
        const res = await client.refresh();
        console.log("res", res)
        user = await client.request(readMe());
        console.log("user", user)

        //save user data for the session
                
	});
</script>

{#if user != null}
	<h1>Welcome, {user.first_name} {user.last_name} {user.email}</h1>
{:else}
	<h1>Logging in...</h1>
{/if}