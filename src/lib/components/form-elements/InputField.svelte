<script>
	import clsx from 'clsx'

	let { label, value, ...rest } = $props()
</script>

<div class={clsx('flex flex-col', rest.class)}>
	<label for={rest.name} class="mb-1 text-sm">{label}</label>
	<input {...rest} id={rest.name} bind:value class="read-only:bg-intranet-gray-100 disabled:bg-intranet-gray-100 rounded read-only:cursor-not-allowed read-only:border-eui-gray-30 read-only:text-eui-gray-70 disabled:cursor-not-allowed disabled:border-eui-gray-30 disabled:text-eui-gray-70" />
</div>
