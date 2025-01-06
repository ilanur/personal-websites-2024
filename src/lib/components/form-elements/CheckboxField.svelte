<script>
	let { value = $bindable(), checked = $bindable(), label, ...rest } = $props()
</script>

<div class={rest.class}>
	<input bind:value type="hidden" name={rest.name} />
	<input bind:checked type="checkbox" id={rest.name} />

	{#if label}
		<label for={rest.name} class="ml-1.5 align-middle">{label}</label>
	{/if}
</div>
