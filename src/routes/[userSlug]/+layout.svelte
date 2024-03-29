<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';

	export let data;
	$: user = data.user;
	$: userPages = data.userPages;

	// console.log('user', data.user);
</script>

<div>
	<UserHeroBanner {user} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation {user} {userPages} isMobile />
	</div>

	<slot />
</div>
