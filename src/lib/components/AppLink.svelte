<script>
	import clsx from 'clsx'
	import IconArrowShort from '$lib/components/icons/IconArrowShort.svelte'

	let { showArrow = false, children, ...rest } = $props()
</script>

<a
	{...rest}
	rel={rest.target === '_blank' ? 'noopener' : null}
	class={clsx(rest.class, 'group inline-flex items-center')}
>
	{@render children?.()}

	{#if showArrow}
		<IconArrowShort class="ml-0.5 size-6 duration-300 group-hover:translate-x-1" />
	{/if}
</a>
