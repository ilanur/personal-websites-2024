<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import SelectField from '$lib/components/form-elements/SelectField.svelte'
	import Button from '$lib/components/Button.svelte'

	let { data } = $props()

	let formLoading = $state(false)

	const user = $derived(data.contensisUser)
	const nationalities = $derived(data.nationalities)
</script>

<div class="container py-16">
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
				value={`${PUBLIC_EUI_WEB}/`}
				readonly
			/>

			<InputField name="slug" value={user.sys.slug} />
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

		<Button type="submit" loading={formLoading}>Submit</Button>
	</form>
</div>
