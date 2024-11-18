<script>
	let { ...rest } = $props()
</script>

<form action="/auth/logout" method="post" class={rest.class}>
	<button aria-label="Logout button">
		<i class="fa-solid fa-right-from-bracket"></i>
	</button>
</form>
