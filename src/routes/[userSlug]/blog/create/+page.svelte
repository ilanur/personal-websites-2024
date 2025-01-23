<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import Button from '$lib/components/Button.svelte'
	import InputField from '$lib/components/form-elements/InputField.svelte'
	import TextArea from '$lib/components/form-elements/TextArea.svelte'
	import PhotoUploader from '$lib/components/PhotoUploader.svelte'
	import TextEditor from '$lib/components/TextEditor.svelte'

	const { data } = $props()

	let loading = $state(false)
	let formErrors = $state()
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	class="flex flex-col gap-4"
	use:enhance={() => {
		loading = true
		formErrors = null

		return async ({ update, result }) => {
			await update({ reset: false })
			loading = false

			const fErrors = result.data?.formErrors ?? null

			if (result.type === 'failure' && fErrors) {
				formErrors = fErrors
			}

			if (result.status === 200) {
				goto(`/${data.currentUserPersonalWebsite.websiteSlug}/blog`)
			}
		}
	}}
>
	<PhotoUploader class="mb-10" name="mainImage" imgContainerClass="w-full h-72" crop={'1200x675'} error={formErrors?.mainImage} />
	<InputField type="text" name="title" label="Title of blogpost" error={formErrors?.title} />
	<TextArea name="description" label="Description" error={formErrors?.description} />
	<TextEditor label="Content" name="content" htmlContent={''} error={formErrors?.content} />

	<div>
		<Button type="submit" {loading}>Submit</Button>
	</div>
</form>
