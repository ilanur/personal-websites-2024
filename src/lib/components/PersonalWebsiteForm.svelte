<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_WEB, PUBLIC_EUI_PERSONAL_WEBSITE_URL, PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import Button from '$lib/components/Button.svelte'
	import clsx from 'clsx'
	import { onMount } from 'svelte'
	import * as GoogleMapsApiLoader from '@googlemaps/js-api-loader'

	let { user, personalWebsite } = $props()

	let fileUploadRef = null
	let formLoading = $state(false)
	let previewPhoto = $state()
	let formErrors = $state()
	let useEuiPhoto = $state(false)
	let city = $state()
	let lat = $state()
	let lng = $state()
	let nationalities = $state()

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

	function disableKeyPress(e) {
		if (e.keyCode == '13') {
			e.preventDefault()
		}
	}

	onMount(async () => {
		try {
			const res = await fetch('/api/nationalities')
			const data = await res.json()
			if (data.nationalities) {
				nationalities = data.nationalities
			}
		} catch (err) {
			console.error('Error fetching nationalities:', err)
		}

		try {
			const loader = new GoogleMapsApiLoader.Loader({
				apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
				version: 'weekly',
				libraries: ['places']
			})

			const library = await loader.importLibrary('places')
			const autoComplete = new library.Autocomplete(document.getElementById('autocomplete'), {
				fields: ['geometry', 'name', 'formatted_address', 'address_components']
			})

			autoComplete.addListener('place_changed', (e) => {
				const place = autoComplete.getPlace()

				if (place.address_components) {
					const address = place.address_components

					city = address.filter((f) => JSON.stringify(f.types) === JSON.stringify(['locality', 'political']))[0].short_name
					lat = place.geometry.location.lat()
					lng = place.geometry.location.lng()
				}
			})
		} catch (e) {
			console.log(`Error loading map: ${e}`)
		}
	})
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
				await update({ reset: false })
				formLoading = false

				if (result.type === 'failure' && result.data.formErrors) {
					formErrors = result.data.formErrors
				}

				if (result.status === 200 && result.data.createdPersonalWebsite) {
					// handle success (maybe redirect)
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

		<div>
			<input type="hidden" name="city" value={city} />
			<InputField name="autocomplete" label="Address" onkeypress={disableKeyPress} />

			<div class="mt-2 flex gap-x-2">
				<InputField readonly name="lat" label="Latitude" value={lat} />
				<InputField readonly name="lng" label="Longitude" value={lng} />
			</div>
		</div>

		<div class="!mt-10">
			<div class="flex">
				<div class="size-60 overflow-hidden rounded-md">
					<input
						bind:this={fileUploadRef}
						accept="image/png, image/jpeg"
						type="file"
						name="photoUpload"
						class="hidden"
						on:change={photoSelected}
					/>

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
							<button
								class="flex size-9 items-center justify-center rounded-full border-2 border-eui-dark-blue-600 p-0.5 text-eui-dark-blue-600 hover:bg-eui-dark-blue-600 hover:text-white"
								aria-label="Upload photo"
								type="button"
								on:click={onPhotoActionClick}
							>
								<i class={clsx('fa-solid', 'fa-upload')}></i>
							</button>
						{/if}

						{#if user.photo && previewPhoto}
							<button
								class="flex size-9 items-center justify-center rounded-full border-2 border-eui-dark-blue-600 p-0.5 text-eui-dark-blue-600 hover:bg-eui-dark-blue-600 hover:text-white"
								aria-label="Change photo"
								type="button"
								on:click={onPhotoActionClick}
							>
								<i class={clsx('fa-solid', 'fa-arrows-rotate')}></i>
							</button>

							<button
								class="flex size-9 items-center justify-center rounded-full border-2 border-eui-dark-blue-600 p-0.5 text-eui-dark-blue-600 hover:bg-eui-dark-blue-600 hover:text-white"
								aria-label="Delete photo"
								type="button"
								on:click={onPhotoDeleteClick}
							>
								<i class={clsx('fa-solid', 'fa-trash')}></i>
							</button>
						{/if}
					</div>
				{/if}
			</div>

			<div class="mt-4 flex items-center">
				<input type="hidden" name="useEuiPhoto" value={useEuiPhoto} />
				<input bind:checked={useEuiPhoto} type="checkbox" id="uploadLocation" name="uploadLocation" />
				<label for="uploadLocation" class="ml-2 mt-px">Use your EUI profile photo</label>
			</div>

			{#if useEuiPhoto && !user.photo}
				<small>You currently have no EUI profile photo set.</small>
			{/if}
		</div>

		<Button type="submit" loading={formLoading}>Submit</Button>
	</form>
</div>
