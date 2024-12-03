<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_WEB, PUBLIC_EUI_PERSONAL_WEBSITE_URL } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import Button from '$lib/components/Button.svelte'
	import clsx from 'clsx'

	let { data } = $props()

	console.log('data', data)

	let formLoading = $state(false)
	let fileUploadRef = null
	let previewPhoto = $state()

	const user = $derived(data.contensisUser)
	const nationalities = $derived(data.nationalities)

	function onPhotoActionClick() {
		fileUploadRef.click()
	}

	function onPhotoDeleteClick() {
		previewPhoto = null
		fileUploadRef.value = null
	}

	function photoSelected(e) {
		const photo = e.target.files[0]

		const reader = new FileReader()
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

			return async ({ update, result }) => {
				await update({ reset: false })
				formLoading = false
				goto(`/${result.data.createdPersonalWebsite.websiteSlug}`)
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
			<InputField
				name="websiteURL"
				label="Your personal website URL"
				value={`${PUBLIC_EUI_PERSONAL_WEBSITE_URL}/`}
				readonly
			/>

			<InputField name="slug" value={user.sys.slug} />
		</div>

		<InputField name="email" type="email" label="E-mail" value={user.euiEmail} readonly />

		<SelectField
			name="nationality"
			options={nationalities}
			label="Nationality"
			placeholder="Select your nationality"
			valuePropertyName="en-GB"
			textPropertyName="en-GB"
		/>

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

				<!-- <img
					src={user.photo
						? `${PUBLIC_EUI_WEB}/${user.photo.asset.sys.uri}`
						: 'https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg'}
					class="size-full object-cover"
					alt={user.nameAndSurnameForTheWeb}
				/> -->

				{#if !previewPhoto}
					<img
						src="https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg"
						class="size-full object-cover"
						alt="Empty profile graphic"
					/>
				{/if}

				{#if previewPhoto}
					<img
						src={previewPhoto}
						class="size-full object-cover"
						alt={user.nameAndSurnameForTheWeb}
					/>
				{/if}
			</div>

			<div class="flex flex-col justify-end gap-2 p-2 px-3">
				{#if !user.photo && !previewPhoto}
					{@render imgActionButton('Upload photo', 'fa-upload', onPhotoActionClick)}
				{/if}

				{#if user.photo || previewPhoto}
					{@render imgActionButton('Change photo', 'fa-arrows-rotate', onPhotoActionClick)}
					{@render imgActionButton('Change photo', 'fa-trash', onPhotoDeleteClick)}
				{/if}
			</div>
		</div>

		<Button type="submit" loading={formLoading}>Submit</Button>
	</form>
</div>

{#snippet imgActionButton(ariaLabel, icon, callback)}
	<button
		class="text-eui-dark-blue-600 border-eui-dark-blue-600 hover:bg-eui-dark-blue-600 flex size-9 items-center justify-center rounded-full border-2 p-0.5 transition hover:text-white"
		aria-label={ariaLabel}
		type="button"
		onclick={callback}
	>
		<i class={clsx('fa-solid text-inherit', icon)}></i>
	</button>
{/snippet}
