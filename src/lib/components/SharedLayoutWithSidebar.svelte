<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import UserContactInfo from '$lib/components/UserContactInfo.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'

	let { data, children } = $props()

	let smallHeroBanner = writable(false)

	const personalWebsite = $derived(data.personalWebsite)
	const personalWebsitePages = $derived(data.personalWebsitePages)
	const hasBlog = $derived(data.hasBlog)

	setContext('smallHeroBanner', smallHeroBanner)
</script>

<UserHeroBanner {personalWebsite} isSmall={$smallHeroBanner} />

<div class="border-b bg-slate-800">
	<PersonalWebsiteNavigation {personalWebsitePages} {personalWebsite} {hasBlog} />
</div>

<div class="container grid grid-cols-3 gap-x-16 py-12 md:py-16 xl:gap-x-36">
	<div class="col-span-3 max-w-prose leading-relaxed lg:col-span-2">
		{@render children?.()}
	</div>
	<div class="border-eui-gray-70 col-span-3 mt-14 border-t pt-14 lg:col-span-1 lg:m-0 lg:border-t-0 lg:p-0">
		<UserContactInfo {personalWebsite} people={personalWebsite.people} />
	</div>
</div>
