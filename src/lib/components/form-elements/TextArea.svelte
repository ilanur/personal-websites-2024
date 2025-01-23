<script>
	import clsx from 'clsx'

	let { label, value = $bindable(), error = null, ...rest } = $props()
</script>

<div class={clsx('relative flex flex-col', rest.class)}>
	<label for={rest.name} class="mb-1 text-sm">{label}</label>
	<textarea
		{...rest}
		id={rest.name}
		bind:value
		class={clsx(
			'min-h-20 rounded read-only:cursor-not-allowed read-only:bg-intranet-gray-100 read-only:opacity-75 disabled:cursor-not-allowed disabled:bg-intranet-gray-100 disabled:opacity-75',
			{
				'border-red-600': error,
				'border-intranet-black-300': !error
			}
		)}
	></textarea>

	{#if error}
		<small class="pl-1 pt-1.5 text-xs text-red-600">{error}</small>
	{/if}
</div>
