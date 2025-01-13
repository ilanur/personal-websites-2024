<script>
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import clsx from 'clsx'
	import CheckboxField from '$lib/components/form-elements/CheckboxField.svelte'

	let { personalWebsite = $bindable(), user } = $props()

	let fileUploadRef = null
	let previewPhoto = $state()
	let useEuiPhoto = $state(personalWebsite.usePeopleProfilePicture)

	$effect(() => {
		if (user.photo && useEuiPhoto) {
			setEuiProfilePhoto()
		}

		if (!useEuiPhoto) {
			onPhotoDeleteClick()
		}
	})

	function setEuiProfilePhoto() {
		previewPhoto = `${PUBLIC_EUI_WEB}/${user.photo.asset.sys.uri}`
	}

	function onPhotoActionClick() {
		fileUploadRef.click()
	}

	function onPhotoDeleteClick() {
		previewPhoto = null
		fileUploadRef.value = null
		useEuiPhoto = false
	}

	function photoSelected(e) {
		const photo = e.target.files[0]
		const reader = new FileReader()

		useEuiPhoto = false

		reader.readAsDataURL(photo)
		reader.onload = (e) => {
			previewPhoto = e.target.result
		}
	}
</script>

<div>
	<div class="flex">
		<div class="size-60 overflow-hidden rounded-md">
			<input bind:this={fileUploadRef} accept="image/png, image/jpeg" type="file" name="photoUpload" class="hidden" onchange={photoSelected} />

			{#if !previewPhoto}
				<img
					src={`${PUBLIC_EUI_WEB}/web-production/code/assets/img/default-user-dark.jpg`}
					class="size-full object-cover"
					alt="Empty profile graphic"
				/>
			{/if}

			{#if previewPhoto}
				<img src={previewPhoto} class="size-full object-cover" alt={user.nameAndSurnameForTheWeb} />
			{/if}
		</div>

		{#if !useEuiPhoto}
			<div class="flex flex-col justify-end gap-2 p-2 px-3">
				{#if !user.photo || !previewPhoto}
					{@render imgActionButton('Upload photo', 'fa-upload', onPhotoActionClick)}
				{/if}

				{#if user.photo && previewPhoto}
					{@render imgActionButton('Change photo', 'fa-arrows-rotate', onPhotoActionClick)}
					{@render imgActionButton('Delete photo', 'fa-trash', onPhotoDeleteClick)}
				{/if}
			</div>
		{/if}
	</div>

	<CheckboxField bind:value={useEuiPhoto} bind:checked={useEuiPhoto} class="mt-4" name="useEuiPhoto" label="Use your EUI profile photo" />

	{#if useEuiPhoto && !user.photo}
		<small>You currently have no EUI profile photo set. As a result, no photo will appear on your personal website.</small>
	{/if}
</div>

{#snippet imgActionButton(ariaLabel, icon, callback)}
	<button
		class="flex size-9 items-center justify-center rounded-full border-2 border-eui-dark-blue-600 p-0.5 text-eui-dark-blue-600 transition hover:bg-eui-dark-blue-600 hover:text-white"
		aria-label={ariaLabel}
		type="button"
		onclick={callback}
	>
		<i class={clsx('fa-solid text-inherit', icon)}></i>
	</button>
{/snippet}
