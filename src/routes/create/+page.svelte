<script>
	import PwCreateForm from '$lib/components/personal-website-form/PwCreateForm.svelte'

	let { data } = $props()
</script>

<div class="container py-12 md:py-16">
	<PwCreateForm user={data.contensisUser} nationalities={data.nationalities} />
</div>
