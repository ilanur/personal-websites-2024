<script>
	import clsx from 'clsx'

	let {
		label,
		value,
		options,
		valuePropertyName = 'value',
		textPropertyName = 'text',
		error = null,
		...rest
	} = $props()
</script>

<div class={clsx('relative flex flex-col', rest.class)}>
	<label for={rest.name} class="mb-1 text-sm">{label}</label>
	<select
		bind:value
		{...rest}
		id={rest.name}
		class={clsx(
			'disabled:bg-intranet-gray-100 w-full cursor-pointer rounded disabled:cursor-not-allowed disabled:border-eui-gray-30 disabled:text-eui-gray-70',
			{
				'border-red-600': error
			}
		)}
	>
		<option value="">{rest.placeholder}</option>
		{#each options as option}
			<option value={option[valuePropertyName]}>{option[textPropertyName]}</option>
		{/each}
	</select>

	{#if error}
		<small class="text-red-600 absolute -bottom-4 pl-1 text-xs">{error}</small>
	{/if}
</div>
