<script>
	import clsx from 'clsx'
	import IconLogoEui from '$lib/components/icons/IconLogoEui.svelte'
	import AppSignIn from './auth/AppSignIn.svelte'
	import AppSignOut from './auth/AppSignOut.svelte'
	import { page } from '$app/stores'

	$: authUser = $page.data.authUser
</script>

<header class={clsx($$props.class, 'bg-white shadow-sm')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10 shrink-0" aria-label="EUI logo">
			<IconLogoEui />
		</a>

		<!-- <MigrateButton /> -->

		<div class="flex items-center">
			{#if authUser}
				{authUser.name}
				<AppSignOut class="ml-3" />
			{:else}
				<AppSignIn />
			{/if}
		</div>
	</nav>
</header>
