<script>
	let { headerSlot, footerSlot, children } = $props()

	let dialogRef
	let isOpen = $state(false)

	export function openModal() {
		isOpen = true
		dialogRef.showModal()
	}

	export function closeModal() {
		isOpen = false
		dialogRef.close()
	}

	export { isOpen }
</script>

<dialog bind:this={dialogRef} class="max-h-[calc(100vh-4rem)] w-full rounded md:max-w-[700px] lg:max-w-[900px]">
	<div class="flex h-full flex-col">
		<header class="flex-shrink-0 border-b bg-gray-50 p-3">
			<div class="flex items-center justify-between">
				{@render headerSlot()}
				<button
					class="flex size-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
					type="button"
					aria-label="Close button"
					onclick={closeModal}
				>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
		</header>

		<div class="flex-1 overflow-y-auto p-3">
			{@render children?.()}
		</div>

		<footer class="flex-shrink-0 border-t bg-gray-50 p-3">
			{@render footerSlot()}
		</footer>
	</div>
</dialog>
