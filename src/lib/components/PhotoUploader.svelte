<script>
	import clsx from 'clsx'
	import Cropper from 'cropperjs'
	import BaseModal from './BaseModal.svelte'

	let { imgContainerClass = '', photo = null, crop, onPhotoSelect = () => {}, ...rest } = $props()

	let fileUploadRef = $state()
	let cropModalRef = $state()
	let previewPhoto = $state(photo)

	function onPhotoActionClick() {
		fileUploadRef.click()
	}

	function onPhotoDeleteClick() {
		previewPhoto = null
		fileUploadRef.value = null
	}

	function photoSelected(e) {
		const selectedPhoto = e.target.files[0]
		const reader = new FileReader()

		if (!crop) {
			onPhotoSelect(selectedPhoto)
		} else {
			cropModalRef.openModal()
		}

		reader.readAsDataURL(selectedPhoto)
		reader.onload = (e) => {
			previewPhoto = e.target.result
		}
	}
</script>

<div class={clsx('flex', rest.class)}>
	<div class={clsx('relative size-60 overflow-hidden rounded-md bg-intranet-gray-100', imgContainerClass)}>
		<input
			bind:this={fileUploadRef}
			accept="image/png,image/jpeg"
			type="file"
			name={rest.name ?? 'photoUpload'}
			class="hidden"
			onchange={photoSelected}
		/>

		{#if !previewPhoto}
			<div class="flex size-full items-center justify-center bg-intranet-gray-100 object-cover">
				<i class="fa-solid fa-image fa-xl text-eui-dark-blue-600"></i>
			</div>
		{/if}

		{#if previewPhoto}
			<img id="preview-img" src={previewPhoto} class="size-full object-contain" alt="Preview" />
		{/if}

		<div class="absolute bottom-0 right-0 z-10 flex gap-3 rounded-tl bg-eui-dark-blue-600 p-3 text-white">
			{#if !previewPhoto}
				{@render imgActionButton('Upload photo', 'fa-upload', onPhotoActionClick)}
			{/if}

			{#if previewPhoto}
				{@render imgActionButton('Change photo', 'fa-arrows-rotate', onPhotoActionClick)}
				{@render imgActionButton('Delete photo', 'fa-trash', onPhotoDeleteClick)}
			{/if}
		</div>
	</div>
</div>

<BaseModal bind:this={cropModalRef}>
	{#snippet headerSlot()}
		Crop image
	{/snippet}

	<img src={previewPhoto} class="size-full object-contain" alt="Preview" />

	{#snippet footerSlot()}
		This is the footer
	{/snippet}
</BaseModal>

{#snippet imgActionButton(ariaLabel, icon, callback)}
	<button
		class="flex size-8 items-center justify-center rounded-full border-2 border-white p-0.5 text-white opacity-80 transition hover:text-white hover:opacity-100"
		aria-label={ariaLabel}
		type="button"
		onclick={callback}
	>
		<i class={clsx('fa-solid text-inherit', icon)}></i>
	</button>
{/snippet}
