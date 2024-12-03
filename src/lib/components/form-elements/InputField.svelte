<script>
	import clsx from 'clsx'

	let { label, value, error = null, ...rest } = $props()
</script>

<div class={clsx('relative flex flex-col', rest.class)}>
	<label for={rest.name} class="mb-1 text-sm">{label}</label>
	<input
		{...rest}
		id={rest.name}
		bind:value
		class={clsx(
			'read-only:bg-intranet-gray-100 disabled:bg-intranet-gray-100 rounded read-only:cursor-not-allowed read-only:opacity-75 disabled:cursor-not-allowed disabled:opacity-75',
			{
				'border-red-600': error
			}
		)}
	/>

	{#if error}
		<small class="text-red-600 absolute -bottom-4 pl-1 text-xs">{error}</small>
	{/if}
</div>
