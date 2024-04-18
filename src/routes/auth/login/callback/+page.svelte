<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';


	export let user = null;

	onMount(async () => {
		const hashParams = getHashParams();
		console.log('hashParams', hashParams)

		const response = await fetch('/auth/login/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: hashParams.id_token })
        });
		const data = await response.json();
		console.log('data', data)


        if (data) {
            user = data.user;
        } else {
            console.error('Failed to validate token');
        }



		if (user) {
			// Token is valid
			console.log('User authenticated:', user);
			// Proceed with user session creation or other logic
		} else {
			// Token is invalid or expired
			console.error('Invalid token');
		}


	});

	function getHashParams() {
    const hash = window.location.hash.substr(1);
    return hash.split('&').reduce(function (result, item) {
        const parts = item.split('=');
        result[parts[0]] = decodeURIComponent(parts[1]);
        return result;
    }, {});
}


</script>

{#if user != null}
	<h1>Welcome, {user.first_name} {user.last_name}</h1>
{:else}
	<h1>Logging in...</h1>
{/if}


