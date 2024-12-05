<script>
	import { page } from '$app/stores'
	import clsx from 'clsx'
	import IconLogoEui from '$lib/components/icons/IconLogoEui.svelte'
	import AppSignIn from './auth/AppSignIn.svelte'
	import AppSignOut from './auth/AppSignOut.svelte'

	let { ...rest } = $props()
	const authUser = $derived($page.data.authUser)
	const personalWebsite = $derived($page.data.personalWebsite)

	// Placeholder function to check if the user's website exists
	// This should be replaced with actual logic or API call
	function userWebsiteExists() {
		if (personalWebsite) return true
		return false // Assume it doesn't exist for now
	}
</script>

<div class={clsx(rest.class, 'border-b bg-white shadow-md')}>
	<nav class="container flex justify-between py-3">
		<a href="/" class="h-10 shrink-0" aria-label="European University Institute logo">
			<IconLogoEui />
		</a>
		<div class="flex items-center">
			{#if authUser}
				{#if userWebsiteExists()}
					<a href="/{personalWebsite.websiteSlug}" class="mr-4 rounded bg-eui-dark-blue-500 px-2 py-1 text-xs font-semibold text-white"
						>Your personal website</a
					>
				{:else}
					<a href="/create" class="mr-4 rounded bg-eui-dark-blue-500 px-2 py-1 text-xs font-semibold text-white">Create Website</a>
				{/if}
				{authUser.name}
				<AppSignOut class="ml-3" />
			{:else}
				<AppSignIn />
			{/if}
		</div>
	</nav>
</div>
