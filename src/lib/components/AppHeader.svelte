<script>
	import clsx from 'clsx';
	import IconLogoEui from '$lib/components/icons/IconLogoEui.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';
	import AppSignIn from './auth/AppSignIn.svelte';
	import AppSignOut from './auth/AppSignOut.svelte';
	import { page } from '$app/stores';

	$: authUser = $page.data.authUser;
	$: user = $page.data.user;
	$: userPages = $page.data.userPages ?? [];
</script>

<header class={clsx($$props.class, 'bg-white shadow-sm')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10 min-h-10" aria-label="EUI logo">
			<IconLogoEui />
		</a>

		<div class="flex items-center">
			<PersonalWebsiteNavigation class="hidden md:flex" {user} {userPages} />

			{#if authUser}
				{authUser.name}
				<AppSignOut class="ml-3" />
			{:else}
				<AppSignIn />
			{/if}
		</div>
	</nav>
</header>
