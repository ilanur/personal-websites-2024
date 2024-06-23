<script>
	import AppButton from '../AppButton.svelte';
</script>

<form action="/auth/login" method="post" class={$$props.class}>
	<AppButton outlined>Login</AppButton>
</form>
