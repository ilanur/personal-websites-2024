<script>
	import { getContext } from 'svelte'
	import PwForm from '$lib/components/personal-website-form/PwForm.svelte'

	let { data } = $props()

	const smallHeroBanner = getContext('smallHeroBanner')

	$smallHeroBanner = true
</script>

<PwForm user={data.user} personalWebsite={data.personalWebsite} />
