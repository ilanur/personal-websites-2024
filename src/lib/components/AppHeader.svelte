<script>
	import clsx from 'clsx';
	import LogoEui from '$lib/components/icons/LogoEui.svelte';
	import AppButton from '$lib/components/AppButton.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';
	import { page } from '$app/stores';
	import { PUBLIC_DIRECTUS_API_URL, PUBLIC_FRONTEND_URL } from '$env/static/public';

	$: user = $page.data.user;
	$: userPages = $page.data.userPages ?? [];

	async function signInWithAzure() {
		const signing_azure_url = `${PUBLIC_DIRECTUS_API_URL}/auth/login/microsoft?redirect=${PUBLIC_FRONTEND_URL}/auth/login/callback`;
		window.location.href = signing_azure_url;
	}
</script>

<header class={clsx($$props.class, 'bg-white')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10 min-h-10" aria-label="EUI logo">
			<LogoEui />
		</a>

		<div class="flex items-center">
			<PersonalWebsiteNavigation class="hidden md:flex" {user} {userPages} />
			<AppButton class="ml-10 whitespace-nowrap lg:ml-12" outlined on:click={signInWithAzure}>
				Log in
			</AppButton>
		</div>
	</nav>
</header>
