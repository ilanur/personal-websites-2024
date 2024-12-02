<script>
	let { children, ...rest } = $props()
</script>

<div class="group inline-flex w-fit items-center font-bold">
	<span class="mr-2 flex size-6 items-center justify-center rounded-full border-2">
		<i class="fa-solid fa-arrow-down fa-xs"></i>
	</span>

	<a {...rest} class="uppercase underline underline-offset-2 group-hover:no-underline">
		{@render children?.()}
	</a>
</div>
