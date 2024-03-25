<script>
	import AppInput from '$lib/components/AppInput.svelte';

	export let data;

	console.log('SESSION', data.user);
</script>

<div class="container py-16">
	<form action="" class="w-fit min-w-60 space-y-5">
		<AppInput name="name" label="Name" value={data.user.cms.nameAndSurnameForTheWeb} disabled />
		<AppInput name="email" type="email" label="E-mail" value={data.user.cms.email} disabled />
	</form>
</div>
