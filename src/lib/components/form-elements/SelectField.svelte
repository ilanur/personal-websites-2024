<script>
	import clsx from 'clsx'

	let { label, value, options, valuePropertyName = 'value', textPropertyName = 'text', ...rest } = $props()
</script>

<div class={clsx('flex flex-col', rest.class)}>
	<label for={rest.name} class="mb-1 text-sm">{label}</label>
	<select bind:value {...rest} id={rest.name} class="disabled:bg-intranet-gray-100 w-full cursor-pointer rounded disabled:cursor-not-allowed disabled:border-eui-gray-30 disabled:text-eui-gray-70">
		<option value="">{rest.placeholder}</option>
		{#each options as option}
			<option value={option[valuePropertyName]}>{option[textPropertyName]}</option>
		{/each}
	</select>
</div>
