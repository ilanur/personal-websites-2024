<script>
	import StudentCard from '../lib/components/StudentCard.svelte';

	export let data;
	console.log('data', data.students);
</script>

<div class="container grid grid-cols-5 gap-5 py-10">
	{#each data.students as student}
		<StudentCard {student} />
	{/each}
</div>
