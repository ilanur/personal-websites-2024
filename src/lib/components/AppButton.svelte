<script>
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	export let outlined = false;

	const dispatch = createEventDispatcher();
</script>

<button
	class={clsx(
		$$props.class,
		'rounded-md border-2 border-eui-blue px-3 py-2 text-sm font-bold transition duration-200 md:px-4 md:py-2.5 md:text-base',
		{
			// Colors
			'bg-eui-blue text-white hover:bg-opacity-90': !outlined,
			'bg-white text-eui-blue hover:bg-eui-blue hover:text-white': outlined
		}
	)}
	on:click={() => dispatch('click')}
>
	<slot />
</button>
