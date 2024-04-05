<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let data;
	$: user = data.user;
	$: userPages = data.userPages;

	let smallHeroBanner = writable(false);
	setContext('smallHeroBanner', smallHeroBanner);
</script>

<div>
	<UserHeroBanner {user} isSmall={$smallHeroBanner} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation {user} {userPages} isMobile />
	</div>

	<slot />
</div>
