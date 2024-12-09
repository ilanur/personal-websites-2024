<script>
	import { getContext } from 'svelte'
	import PersonalWebsiteForm from '$lib/components/PersonalWebsiteForm.svelte'

	let { data } = $props()
	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<PersonalWebsiteForm user={data.user} personalWebsite={data.personalWebsite} />
