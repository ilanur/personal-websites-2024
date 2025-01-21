<script>
	import clsx from 'clsx'
	import Cropper from 'cropperjs'
	import BaseModal from './BaseModal.svelte'
	import 'cropperjs/dist/cropper.css'

	let { imgContainerClass = '', photo = null, crop, onPhotoSelect = () => {}, onPhotoDeleteClick = () => {}, ...rest } = $props()

	let cropperInstance = $state()
	let fileUploadRef = $state()
	let cropModalRef = $state()
	let previewPhoto = $state(photo)
	let previewPhotoCrop = $state()
	let croppedFile = $state(null)

	$effect(() => {
		if (cropModalRef && cropModalRef.isOpen) {
			setTimeout(initCropper, 0)
		} else {
			destroyCropper()
		}
	})

	let aspectRatio = $derived.by(() => {
		if (typeof crop === 'string' && crop.includes('x')) {
			const [width, height] = crop.split('x').map(Number)
			return width && height ? width / height : undefined
		}

		return undefined
	})

	function initCropper() {
		if (previewPhotoCrop && !cropperInstance) {
			cropperInstance = new Cropper(previewPhotoCrop, {
				aspectRatio,
				viewMode: 1
			})
		}
	}

	function destroyCropper() {
		if (cropperInstance) {
			cropperInstance.destroy()
			cropperInstance = null
		}
	}

	function resetCroppedState() {
		croppedFile = null
	}

	function onPhotoActionClick() {
		resetCroppedState()
		fileUploadRef.click()
	}

	function deletePhoto() {
		previewPhoto = null
		fileUploadRef.value = null
		resetCroppedState()
		onPhotoDeleteClick()
	}

	function photoSelected(e) {
		const selectedPhoto = e.target.files[0]
		if (!selectedPhoto) return

		const reader = new FileReader()

		reader.onload = (e) => {
			previewPhoto = e.target.result

			if (crop) {
				cropModalRef.openModal()
			} else {
				onPhotoSelect(selectedPhoto)
			}
		}

		reader.readAsDataURL(selectedPhoto)
	}

	function applyCrop() {
		if (cropperInstance) {
			let targetWidth, targetHeight

			if (typeof crop === 'string' && crop.includes('x')) {
				;[targetWidth, targetHeight] = crop.split('x').map(Number)
			}

			const croppedCanvas = cropperInstance.getCroppedCanvas({
				width: targetWidth,
				height: targetHeight
			})

			if (croppedCanvas) {
				croppedCanvas.toBlob((blob) => {
					const file = new File([blob], 'cropped_image.png', { type: 'image/png' })
					croppedFile = file
					previewPhoto = URL.createObjectURL(blob)
					cropModalRef.closeModal()
					onPhotoSelect(file)
					updateFileInput(file)
				}, 'image/png')
			}
		}
	}

	function updateFileInput(file) {
		const dataTransfer = new DataTransfer()
		dataTransfer.items.add(file)
		fileUploadRef.files = dataTransfer.files
	}

	function onCancelClick() {
		cropModalRef.closeModal()
		previewPhoto = null
	}

	export function setPreviewPhoto(photo) {
		previewPhoto = photo
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
				{@render imgActionButton('Delete photo', 'fa-trash', deletePhoto)}
			{/if}
		</div>
	</div>
</div>

<BaseModal bind:this={cropModalRef}>
	{#snippet headerSlot()}
		Crop image
	{/snippet}

	<div>
		<img bind:this={previewPhotoCrop} src={previewPhoto} class="size-full max-h-[50vh] object-contain" alt="Preview" />
	</div>

	{#snippet footerSlot()}
		<div class="flex justify-end gap-3">
			<button type="button" onclick={onCancelClick}>Cancel</button>
			<button type="button" onclick={applyCrop}>Apply</button>
		</div>
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
