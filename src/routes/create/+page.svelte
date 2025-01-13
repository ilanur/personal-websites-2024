<script>
	import PwForm from '$lib/components/personal-website-form/PwForm.svelte'

	let { data } = $props()
</script>

<div class="container py-12 md:py-16">
	<PwForm user={data.contensisUser} />
</div>
