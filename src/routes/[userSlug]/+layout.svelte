<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import FunctionCallingPrompt from '$lib/components/FunctionCallingPrompt.svelte'

	let { data, children } = $props()

	let smallHeroBanner = writable(false)

	const personalWebsite = $derived(data.personalWebsite)
	const personalWebsitePages = $derived(data.personalWebsitePages)

	setContext('smallHeroBanner', smallHeroBanner)

	console.log('data', data)
</script>

<div>
	<UserHeroBanner {personalWebsite} isSmall={$smallHeroBanner} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation {personalWebsitePages} {personalWebsite} />
	</div>

	{@render children?.()}

	<FunctionCallingPrompt class="fixed bottom-8 right-8" />
</div>
