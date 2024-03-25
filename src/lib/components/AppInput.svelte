<script>
	export let name;
	export let label = '';
	export let value = '';
</script>

<div class="flex flex-col">
	<label for={name}>{label}</label>
	<input
		bind:value
		{name}
		{...$$restProps}
		class="rounded disabled:cursor-not-allowed disabled:bg-eui-gray"
	/>
</div>
