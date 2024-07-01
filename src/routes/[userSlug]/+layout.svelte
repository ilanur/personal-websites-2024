<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte'
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte'
	import { writable } from 'svelte/store'
	import { setContext } from 'svelte'

	export let data

	let smallHeroBanner = writable(false)

	$: personalInformation = data.personalInformation
	$: userPages = data.userPages

	setContext('smallHeroBanner', smallHeroBanner)
</script>

<div>
	<UserHeroBanner {personalInformation} isSmall={$smallHeroBanner} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation {personalInformation} {userPages} isMobile />
	</div>

	<slot />
</div>
