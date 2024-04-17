<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import jwt from 'jsonwebtoken';


	export let user = null;

	onMount(async () => {
		const hashParams = getHashParams();
		console.log('hashParams', hashParams)
		const receivedIdToken = hashParams.id_token;
		console.log('receivedIdToken', receivedIdToken)

		//now validate the token with the server
		const response = await fetch('https://cms-eui.cloud.contensis.com/authenticate/.well-known/openid-configuration');
			const { jwks_uri } = await response.json();
			const jwksResponse = await fetch(jwks_uri);
			const jwks = await jwksResponse.json();
			
			// Assuming the JWT includes the `kid` header to match the key
			const signingKey = jwks.keys.find(key => key.use === 'sig' && key.kty === 'RSA');
			console.log('signingKey', signingKey)

			if (!signingKey) {
				throw new Error('Valid signing key not found in jwks');
			}

			// Convert the RSA public key to a PEM format for jwt.verify
			const pem = `-----BEGIN PUBLIC KEY-----\n${signingKey.x5c[0]}\n-----END PUBLIC KEY-----`;
			user = jwt.verify(receivedIdToken, pem, { algorithms: ['RS256'] });
			console.log('user', user)



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


