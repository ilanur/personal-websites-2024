<script>
	import { getContext } from 'svelte'
	import PwSettingsForm from '$lib/components/personal-website-form/PwSettingsForm.svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<PwSettingsForm user={data.user} personalWebsite={data.personalWebsite} nationalities={data.nationalities} />
