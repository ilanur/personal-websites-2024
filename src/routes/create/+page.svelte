<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_WEB, PUBLIC_EUI_PERSONAL_WEBSITE_URL } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import Button from '$lib/components/Button.svelte'
	import clsx from 'clsx'

	let { data } = $props()

	let fileUploadRef = null
	let formLoading = $state(false)
	let previewPhoto = $state()
	let formErrors = $state()
	let useEuiPhoto = $state(false)

	const user = $derived(data.contensisUser)
	const nationalities = $derived(data.nationalities)

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

<div class="container mx-auto py-16">
	<form
		method="POST"
		class="space-y-5 sm:w-fit sm:min-w-80"
		enctype="multipart/form-data"
		use:enhance={() => {
			formLoading = true
			formErrors = null

			return async ({ update, result }) => {
				console.log('result', result)
				await update({ reset: false })
				formLoading = false

				if (result.type === 'failure' && result.data.formErrors) {
					formErrors = result.data.formErrors
				}

				if (result.status === 200 && result.data.createdPersonalWebsite) {
					goto(`/${result.data.createdPersonalWebsite.websiteSlug}`)
				}
			}
		}}
	>
		<InputField
			class="col-span-2 sm:col-span-1"
			name="title"
			label="Title of your personal website"
			value={user.nameAndSurnameForTheWeb}
			readonly
		/>

		<div class="grid grid-cols-1 items-end gap-2 md:grid-cols-2">
			<InputField name="websiteURL" label="Your personal website URL" value={`${PUBLIC_EUI_PERSONAL_WEBSITE_URL}/`} readonly />
			<InputField name="slug" value={user.sys.slug} placeholder="website slug" error={formErrors?.slug} />
		</div>

		<InputField name="email" type="email" label="E-mail" value={user.euiEmail} readonly />

		<SelectField
			name="nationality"
			options={nationalities}
			label="Nationality"
			placeholder="Select your nationality"
			valuePropertyName="en-GB"
			textPropertyName="en-GB"
			error={formErrors?.nationality}
		/>

		<div class="!mt-10">
			<div class="flex">
				<div class="size-60 overflow-hidden rounded-md">
					<input
						bind:this={fileUploadRef}
						accept="image/png, image/jpeg"
						type="file"
						name="photoUpload"
						class="hidden"
						onchange={photoSelected}
					/>

					{#if !previewPhoto}
						<img
							src="https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg"
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

			<div class="mt-4 flex items-center">
				<input bind:value={useEuiPhoto} type="hidden" name="useEuiPhoto" />
				<input bind:checked={useEuiPhoto} type="checkbox" id="uploadLocation" name="uploadLocation" />
				<label for="uploadLocation" class="ml-2 mt-px">Use your EUI profile photo</label>
			</div>
		</div>

		<Button type="submit" loading={formLoading}>Submit</Button>
	</form>
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
