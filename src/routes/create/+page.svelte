<script>
	import { enhance } from '$app/forms'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import AppButton from '$lib/components/AppButton.svelte'

	export let data

	let formLoading = false

	console.log('data', data)

	$: user = data.contensisUser
	$: nationalities = data.nationalities.fields[0].validations.allowedValues.values
</script>

<div class="container py-16">
	<form
		method="POST"
		class="space-y-5 sm:w-fit sm:min-w-80"
		enctype="multipart/form-data"
		use:enhance={() => {
			formLoading = true

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
			value={user.nameAndSurnameForTheWeb}
			readonly
		/>

		<div class="flex items-end gap-x-2">
			<InputField
				class="col-span-2 sm:col-span-1"
				name="websiteURL"
				label="Your personal website URL"
				value={`${PUBLIC_EUI_WEB}/`}
				readonly
			/>

			<InputField class="col-span-2 sm:col-span-1" name="slug" value={user.sys.slug} />
		</div>

		<InputField name="email" type="email" label="E-mail" value={user.euiEmail} readonly />

		<div class="grid grid-cols-2 gap-5">
			<InputField name="firstName" type="text" label="Firstname" value={user.firstnames} readonly />
			<InputField name="lastName" type="text" label="Lastname" value={user.lastnames} readonly />
		</div>

		<SelectField
			name="nationality"
			options={nationalities}
			label="Nationality"
			placeholder="Select your nationality"
			valuePropertyName="en"
			textPropertyName="en"
		/>

		<div class="relative size-60 overflow-hidden rounded-md">
			<img
				src={user.photo
					? `${PUBLIC_EUI_WEB}/${user.photo.asset.sys.uri}`
					: 'https://www.eui.eu/web-production/code/assets/img/default-user-dark.jpg'}
				class="size-full object-cover"
				alt={user.nameAndSurnameForTheWeb}
			/>
		</div>

		<AppButton type="submit" loading={formLoading}>Submit</AppButton>
	</form>
</div>
