<script>
	import { page } from '$app/stores';
</script>

<h1>Something went wrong {$page.status} {$page.error.message}</h1>
