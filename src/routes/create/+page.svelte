<script>
	import { enhance } from '$app/forms'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import AppSelect from '$lib/components/AppSelect.svelte'
	import AppButton from '$lib/components/AppButton.svelte'
	import IconPencil from '$lib/components/icons/IconPencil.svelte'
	import nationalities from '$lib/constants/nationalities.json'

	export let data

	let fileInputRef
	let imageChanged = false
	let formLoading = false

	function onChangeProfileImageClick() {
		fileInputRef.click()
	}

	$: user = data.algoliaUser
</script>

<div class="container py-16">
	<form
		method="POST"
		class="space-y-5 sm:w-fit sm:min-w-80"
		enctype="multipart/form-data"
		use:enhance={({ formData }) => {
			formLoading = true

			if (!imageChanged) {
				formData.delete('fileToUpload')
			}

			return async ({ update }) => {
				await update({ reset: false })
				formLoading = false
			}
		}}
	>
		<InputField
			class="col-span-2 sm:col-span-1"
			name="title"
			label="Title of your personal website"
			value={`${user.ict.Firstnames} ${user.ict.Lastnames}`}
			readonly
		/>

		<InputField
			class="col-span-2 sm:col-span-1"
			name="slug"
			label="Your personal website URL"
			value={`${PUBLIC_EUI_WEB}/${user.objectID}`}
			readonly
		/>

		<InputField name="email" type="email" label="E-mail" value={user.ict.EuiEmail} readonly />

		<div class="grid grid-cols-2 gap-5">
			<InputField
				name="first_name"
				type="text"
				label="Firstname"
				value={user.ict.Firstnames}
				readonly
			/>
			<InputField
				name="last_name"
				type="text"
				label="Lastname"
				value={user.ict.Lastnames}
				readonly
			/>
		</div>

		<AppSelect
			name="nationality"
			options={nationalities}
			label="Nationality"
			placeholder="Select your nationality"
			valuePropertyName="id"
		/>

		<div class="relative size-60 overflow-hidden rounded-md">
			<!-- <input
						bind:this={fileInputRef}
						id="file"
						type="file"
						name="avatar"
						class="hidden"
						accept=".jpg,.jpeg,.png,.webp"
						on:change={onImageSelected}
					/> -->

			<img
				src={user.ict.Photo ||
					'https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg'}
				class="size-full object-cover"
				alt={`${user.ict.Firstnames} ${user.ict.Lastnames}`}
			/>

			<button
				class="absolute right-2 top-2 size-10 rounded-full bg-eui-gray-90 bg-opacity-70 p-2.5 text-white duration-150 hover:p-2"
				type="button"
				on:click={onChangeProfileImageClick}
			>
				<IconPencil />
			</button>
		</div>

		<AppButton type="submit" loading={formLoading}>Submit</AppButton>
	</form>
</div>
