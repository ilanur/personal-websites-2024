<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'

	let { data, children } = $props()

	let smallHeroBanner = writable(false)

	const personalWebsite = $derived(data.personalWebsite)
	const personalWebsitePages = $derived(data.personalWebsitePages)

	setContext('smallHeroBanner', smallHeroBanner)
</script>

<div>
	<UserHeroBanner {personalWebsite} isSmall={$smallHeroBanner} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation {personalWebsitePages} {personalWebsite} />
	</div>

	{@render children?.()}
</div>
