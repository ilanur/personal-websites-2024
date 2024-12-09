<script>
	import PersonalWebsiteForm from '$lib/components/PersonalWebsiteForm.svelte'

	let { data } = $props()
</script>

<PersonalWebsiteForm user={data.contensisUser} />
