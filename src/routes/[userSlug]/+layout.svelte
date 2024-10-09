<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import { writable } from 'svelte/store'
	import { setContext } from 'svelte'

	export let data

	let smallHeroBanner = writable(false)

	$: personalWebsite = data.personalWebsite

	setContext('smallHeroBanner', smallHeroBanner)

	console.log('Data', data)
</script>

<div>
	<UserHeroBanner {personalWebsite} isSmall={$smallHeroBanner} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation {personalWebsite} isMobile />
	</div>

	<slot />
</div>
