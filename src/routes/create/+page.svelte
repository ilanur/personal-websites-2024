<script>
	import PersonalWebsiteForm from '$lib/components/PersonalWebsiteForm.svelte'

	let { data, ...rest } = $props()
</script>

<PersonalWebsiteForm user={data.contensisUser} />
