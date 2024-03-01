<script>
	import clsx from 'clsx';
	import ArrowShort from '$lib/components/icons/ArrowShort.svelte';

	export let href = null;
	export let target = null;
	export let showArrow = false;
</script>

<a
	{href}
	{target}
	rel={target === '_blank' ? 'noopener' : null}
	class={clsx($$props.class, 'group inline-flex items-center')}
>
	<slot />

	{#if showArrow}
		<ArrowShort class="ml-0.5 size-6 duration-300 group-hover:translate-x-1" />
	{/if}
</a>
