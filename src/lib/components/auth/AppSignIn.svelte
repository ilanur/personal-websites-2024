<script>
	import Button from '$lib/components/Button.svelte'

	let { ...rest } = $props()
</script>

<form action="/auth/login" method="post" class={rest.class}>
	<Button outlined>Login</Button>
</form>
