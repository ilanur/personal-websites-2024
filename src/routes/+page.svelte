<script>
	import UserCard from '../lib/components/UserCard.svelte';
	import HorizontalSearch from '$lib/components/HorizontalSearch.svelte';

	export let data;

</script>

<HorizontalSearch />

<div class="container grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each data.users as user}
		<UserCard {user} />
	{/each}
</div>