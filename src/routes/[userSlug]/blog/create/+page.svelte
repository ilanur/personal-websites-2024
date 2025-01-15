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
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	class="flex flex-col gap-4"
	use:enhance={() => {
		loading = true

		return async () => {
			loading = false
			goto(`/${data.currentUserPersonalWebsite.websiteSlug}/blog`)
		}
	}}
>
	<PhotoUploader class="mb-10" name="mainImage" imgContainerClass="w-full h-72" />

	<InputField type="text" name="title" label="Title of blogpost" />
	<TextArea name="description" label="Description" />
	<TextEditor label="Content" name="content" htmlContent={''} />

	<div>
		<Button type="submit" {loading}>Submit</Button>
	</div>
</form>
