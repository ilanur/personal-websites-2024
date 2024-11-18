<script>
	import AppButton from '$lib/components/AppButton.svelte'

	let { ...rest } = $props()
</script>

<form action="/auth/login" method="post" class={rest.class}>
	<AppButton outlined>Login</AppButton>
</form>
