<script>
	import clsx from 'clsx'

	export let label = ''
	export let value = ''
</script>

<div class={clsx('flex flex-col', $$props.class)}>
	<label for={$$restProps.name} class="mb-1 text-sm">{label}</label>
	<input
		bind:value
		{...$$restProps}
		class="rounded read-only:cursor-not-allowed read-only:border-eui-gray-30 read-only:bg-eui-gray read-only:text-eui-gray-70 disabled:cursor-not-allowed disabled:border-eui-gray-30 disabled:bg-eui-gray disabled:text-eui-gray-70"
		id={$$restProps.name}
	/>
</div>
