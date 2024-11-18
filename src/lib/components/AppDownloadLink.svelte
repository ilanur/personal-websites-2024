<script>
	let { onclick, children } = $props()
</script>

<button class="group inline-flex w-fit items-center font-bold" {onclick}>
	<span class="mr-2 flex size-6 items-center justify-center rounded-full border-2">
		<i class="fa-solid fa-arrow-down fa-xs"></i>
	</span>

	<span class="uppercase underline underline-offset-2 group-hover:no-underline">
		{@render children?.()}
	</span>
</button>
