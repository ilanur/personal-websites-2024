<script>
	import clsx from 'clsx'

	let { label, value, options, valuePropertyName = 'value', textPropertyName = 'text', error = null, ...rest } = $props()
</script>

<div class={clsx('relative flex flex-col', rest.class)}>
	<label for={rest.name} class="mb-1 text-sm">{label}</label>
	<select
		bind:value
		{...rest}
		id={rest.name}
		class={clsx(
			'disabled:border-eui-gray-30 disabled:text-eui-gray-70 w-full cursor-pointer rounded disabled:cursor-not-allowed disabled:bg-intranet-gray-100',
			{
				'border-red-600': error,
				'border-intranet-black-300': !error
			}
		)}
	>
		<option value="">{rest.placeholder}</option>
		{#each options as option}
			<option value={option[valuePropertyName]}>{option[textPropertyName]}</option>
		{/each}
	</select>

	{#if error}
		<small class="pl-1 pt-1.5 text-xs text-red-600">{error}</small>
	{/if}
</div>
