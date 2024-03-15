<script>
	import UserCard from '../lib/components/UserCard.svelte';

	export let data;
</script>

<div class="container grid grid-cols-5 gap-5 py-10">
	{#each data.users as user}
		<UserCard {user} />
	{/each}
</div>
