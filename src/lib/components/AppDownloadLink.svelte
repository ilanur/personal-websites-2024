<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button class="group inline-flex w-fit items-center font-bold" on:click={() => dispatch('click')}>
	<span class="mr-2 flex size-6 items-center justify-center rounded-full border-2">
		<i class="fa-solid fa-arrow-down fa-xs" />
	</span>

	<span class="uppercase underline underline-offset-2 group-hover:no-underline">
		<slot />
	</span>
</button>
