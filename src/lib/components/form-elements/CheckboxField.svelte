<script>
	let { value = $bindable(), checked = $bindable(), label, ...rest } = $props()
</script>

<div>
	<input bind:value type="hidden" name={rest.id} />
	<input bind:checked type="checkbox" id={rest.id} />

	{#if label}
		<label for={rest.id} class="ml-1.5 align-middle">{label}</label>
	{/if}
</div>
