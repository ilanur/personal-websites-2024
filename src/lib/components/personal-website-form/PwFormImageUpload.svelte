<script>
	import { onMount, tick } from 'svelte'

	let { image } = $props()

	let inputRef = $state()
	let showImage = $state(false)
	let img = $state()

	onMount(async () => {
		if (image) {
			showImage = true
			await tick()
			img = image
		}
	})

	function onFileSelect(e) {
		const file = e.target.files[0]

		console.log('file', file)

		if (file) {
			showImage = true

			const reader = new FileReader()

			reader.addEventListener('load', function () {
				img = reader.result
			})

			reader.readAsDataURL(file)

			return
		}
	}
</script>

<input bind:this={inputRef} type="file" accept="image/png,image/jpeg" name="photoUpload" onchange={onFileSelect} />

<div>
	{#if img}
		<img src={img} alt="Preview" />
	{:else}
		<span>Image Preview</span>
	{/if}
</div>
