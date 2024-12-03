<script>
	import { page } from '$app/stores'
	import clsx from 'clsx'
	import IconLogoEui from '$lib/components/icons/IconLogoEui.svelte'
	import AppSignIn from './auth/AppSignIn.svelte'
	import AppSignOut from './auth/AppSignOut.svelte'

	let { ...rest } = $props()
	const authUser = $derived($page.data.authUser)
</script>

<header class={clsx(rest.class, 'border-b bg-white shadow-md')}>
	<nav class="container flex justify-between py-3">
		<a href="/" class="h-10 shrink-0" aria-label="European University Institute logo">
			<IconLogoEui />
		</a>
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
