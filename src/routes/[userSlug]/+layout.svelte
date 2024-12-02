<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import AIEditorAssistant from '$lib/components/AIEditorAssistant.svelte'

	let { data, children } = $props()

	let smallHeroBanner = writable(false)

	const personalWebsite = $derived(data.personalWebsite)
	const personalWebsitePages = $derived(data.personalWebsitePages)
	const hasBlog = $derived(data.hasBlog)

	setContext('smallHeroBanner', smallHeroBanner)
</script>

<div>
	<UserHeroBanner {personalWebsite} isSmall={$smallHeroBanner} />

	<div class="bg-intranet-gray-100">
		<PersonalWebsiteNavigation {personalWebsitePages} {personalWebsite} {hasBlog} />
	</div>

	{@render children?.()}

	{#if data.authUser}
		<AIEditorAssistant class="fixed bottom-8 right-8" />
	{/if}
</div>
