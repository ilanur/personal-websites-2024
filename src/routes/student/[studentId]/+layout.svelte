<script>
	import StudentHeroBanner from '$lib/components/StudentHeroBanner.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';

	export let data;
</script>

<div>
	<StudentHeroBanner student={data.student} />

	<div class="bg-eui-gray">
		<PersonalWebsiteNavigation isMobile />
	</div>

	<slot />
</div>
