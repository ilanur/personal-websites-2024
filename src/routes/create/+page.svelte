<script>
	import PwForm from '$lib/components/personal-website-form/PwForm.svelte'

	let { data } = $props()
</script>

<PwForm user={data.contensisUser} />
