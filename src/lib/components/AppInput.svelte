<script>
	import clsx from 'clsx';

	export let name;
	export let label = '';
	export let value = '';
</script>

<div class={clsx('flex flex-col', $$props.class)}>
	<label for={name}>{label}</label>
	<input
		bind:value
		{name}
		{...$$restProps}
		class="rounded disabled:cursor-not-allowed disabled:border-eui-gray-30 disabled:bg-eui-gray disabled:text-eui-gray-70"
	/>
</div>
