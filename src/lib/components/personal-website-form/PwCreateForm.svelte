<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_PERSONAL_WEBSITE_URL, PUBLIC_EUI_WEB } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import CheckboxField from '$lib/components/form-elements/CheckboxField.svelte'
	import LocationSelect from '$lib/components/personal-website-form/LocationSelect.svelte'
	import PhotoUploader from '$lib/components/PhotoUploader.svelte'
	import Button from '$lib/components/Button.svelte'

	let { user, nationalities } = $props()

	let formLoading = $state(false)
	let formErrors = $state()
	let useEuiPhoto = $state(false)
	let photo = $state()
	let photoUploader = $state()

	$effect(() => {
		if (user.photo && useEuiPhoto) {
			photo = `${PUBLIC_EUI_WEB}${user.photo.asset.sys.uri}`
			photoUploader.setPreviewPhoto(photo)
		}

		if (!useEuiPhoto) {
			photo = null
		}
	})
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	class="grid grid-cols-1 items-start gap-10 lg:grid-cols-2"
	use:enhance={() => {
		formLoading = true
		formErrors = null

		return async ({ update, result }) => {
			await update({ reset: false })
			formLoading = false
			const fErrors = result.data?.formErrors ?? null

			if (result.type === 'failure' && fErrors) {
				formErrors = fErrors
			}

			if (result.status === 200 && result.data.createdPersonalWebsite) {
				goto(`/${result.data.createdPersonalWebsite.websiteSlug}`)
			}
		}
	}}
>
	<div class="flex flex-col">
		<p class="mb-4 font-bold">General settings</p>

		<InputField
			class="col-span-2 sm:col-span-1"
			name="title"
			label="Title of your personal website"
			value={user.nameAndSurnameForTheWeb}
			readonly
			error={formErrors?.title}
		/>

		<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-2 md:gap-2">
			<InputField label="Your personal website URL" value={`${PUBLIC_EUI_PERSONAL_WEBSITE_URL}/`} readonly />
			<InputField name="slug" label="Slug" value={user.sys.slug} placeholder="website slug" error={formErrors?.slug} />
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

		<LocationSelect error={formErrors?.city} />
	</div>

	<div class="pt-[3.75rem]">
		<PhotoUploader
			bind:this={photoUploader}
			{photo}
			crop={'400x400'}
			onPhotoSelect={() => (useEuiPhoto = false)}
			onPhotoDeleteClick={() => (useEuiPhoto = false)}
		/>
		<CheckboxField bind:value={useEuiPhoto} class="mt-4" name="useEuiPhoto" label="Use your EUI profile photo" />

		{#if useEuiPhoto && !user.photo}
			<small>You currently have no EUI profile photo set. As a result, no photo will appear on your personal website.</small>
		{/if}
	</div>

	<div>
		<Button loading={formLoading}>Create personal website</Button>
	</div>
</form>
