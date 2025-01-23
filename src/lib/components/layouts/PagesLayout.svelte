<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import UserContactInfo from '$lib/components/UserContactInfo.svelte'
	import { smallUserBanner } from '$lib/stores/hero-banner-store'

	let { data, children, hasSidebar } = $props()

	const personalWebsite = $derived(data.personalWebsite)
	const personalWebsitePages = $derived(data.personalWebsitePages)
	const hasBlog = $derived(data.hasBlog)
	const authUser = $derived(data.authUser)
</script>

<UserHeroBanner {personalWebsite} {authUser} isSmall={$smallUserBanner} />

<div class="border-b bg-slate-800">
	<nav>
		<h2 class="sr-only">Subsite navigation</h2>
		<PersonalWebsiteNavigation {personalWebsitePages} {personalWebsite} hasBlog={hasBlog || authUser?.email === personalWebsite.people.email} />
	</nav>
</div>

<div class="container grid grid-cols-3 gap-x-16 py-12 md:py-16 xl:gap-x-36">
	{#if hasSidebar}
		<main class="col-span-3 max-w-prose leading-relaxed lg:col-span-2">
			{@render children?.()}
		</main>
		<aside class="border-eui-gray-70 col-span-3 mt-14 border-t pt-14 lg:col-span-1 lg:m-0 lg:border-t-0 lg:p-0">
			<UserContactInfo {personalWebsite} people={personalWebsite.people} />
		</aside>
	{:else}
		<main class="col-span-3">
			{@render children?.()}
		</main>
	{/if}
</div>
