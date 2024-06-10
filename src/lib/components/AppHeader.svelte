<script>
	import clsx from 'clsx';
	// import Oidc from 'oidc-client';
	import IconLogoEui from '$lib/components/icons/IconLogoEui.svelte';
	import AppButton from '$lib/components/AppButton.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';
	import { page } from '$app/stores';
	import { PUBLIC_FRONTEND_URL, PUBLIC_DIRECTUS_API_URL } from '$env/static/public';
	// import MigrateButton from './MigrateButton.svelte';

	$: user = $page.data.user;
	$: userPages = $page.data.userPages ?? [];

	// const settings = {
	// 	authority: 'https://cms-eui.cloud.contensis.com/authenticate/',
	// 	client_id: 'WebsiteAdfsClient',
	// 	redirect_uri: PUBLIC_FRONTEND_URL + '/auth/login/callback',
	// 	post_logout_redirect_uri: PUBLIC_FRONTEND_URL,
	// 	response_type: 'id_token',
	// 	scope: 'openid',
	// 	filterProtocolClaims: false
	// };

	async function signInWithAzure() {
		// let mgr = new Oidc.UserManager(settings);
		// await mgr.signinRedirect();

		const signing_azure_url = `${PUBLIC_DIRECTUS_API_URL}/auth/login/azure?redirect=${PUBLIC_FRONTEND_URL}/auth/login/callback`;
		window.location.href = signing_azure_url;
	}
</script>

<header class={clsx($$props.class, 'bg-white shadow-sm')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10 min-h-10" aria-label="EUI logo">
			<IconLogoEui />
		</a>

		<div class="flex items-center">
			<PersonalWebsiteNavigation class="hidden md:flex" {user} {userPages} />

			<!-- <MigrateButton /> -->

			<AppButton class="ml-10 whitespace-nowrap lg:ml-12" outlined on:click={signInWithAzure}>
				Log in
			</AppButton>
		</div>
	</nav>
</header>
