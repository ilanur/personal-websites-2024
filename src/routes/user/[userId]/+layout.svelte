<script>
	import UserHeroBanner from '$lib/components/UserHeroBanner.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';

	export let data;
</script>

<div>
	<UserHeroBanner user={data.user} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation isMobile />
	</div>

	<slot />
</div>
