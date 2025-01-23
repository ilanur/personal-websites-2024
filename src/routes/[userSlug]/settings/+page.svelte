<script>
	import { smallUserBanner } from '$lib/stores/hero-banner-store'
	import PwSettingsForm from '$lib/components/personal-website-form/PwSettingsForm.svelte'

	let { data } = $props()

	smallUserBanner.set(true)
</script>

<PwSettingsForm user={data.user} personalWebsite={data.personalWebsite} nationalities={data.nationalities} />
