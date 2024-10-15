<script>
	import clsx from 'clsx'

	export let label = ''
	export let value = ''
	export let options = []
	export let valuePropertyName = 'value'
	export let textPropertyName = 'text'
</script>

<div class={clsx('flex flex-col', $$props.class)}>
	<label for={$$restProps.name} class="mb-1 text-sm">{label}</label>
	<select
		bind:value
		{...$$restProps}
		id={$$restProps.name}
		class="w-full cursor-pointer rounded disabled:cursor-not-allowed disabled:border-eui-gray-30 disabled:bg-eui-gray disabled:text-eui-gray-70"
	>
		<option value="">{$$restProps.placeholder}</option>
		{#each options as option}
			<option value={option[valuePropertyName]}>{option[textPropertyName]}</option>
		{/each}
	</select>
</div>
