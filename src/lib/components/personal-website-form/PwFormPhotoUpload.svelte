<script>
	import { onMount } from 'svelte'
	import { PUBLIC_EUI_WEB } from '$env/static/public'
	import PhotoUploader from '$lib/components/PhotoUploader.svelte'
	import CheckboxField from '$lib/components/form-elements/CheckboxField.svelte'

	let { personalWebsite = $bindable(), user } = $props()

	let fileUploadRef = $state()
	let newUploaded = $state(false)
	let useEuiPhoto = $state(personalWebsite?.usePeopleProfilePicture)

	console.log('personalWebsite pw form', personalWebsite)

	onMount(() => {
		console.log('PW FORM', `${PUBLIC_EUI_WEB}${personalWebsite.image?.asset.sys.uri}`)

		if (personalWebsite?.usePeopleProfilePicture) {
			setEuiProfilePhoto()
		}

		if (personalWebsite?.image?.asset?.sys.uri) {
			fileUploadRef.setPreviewPhoto(`${PUBLIC_EUI_WEB}${personalWebsite.image.asset.sys.uri}`)
		}
	})

	$effect(() => {
		if (user?.photo && useEuiPhoto) {
			setEuiProfilePhoto()
			newUploaded = false
		} else if (personalWebsite?.image?.asset?.sys.uri && !personalWebsite?.usePeopleProfilePicture) {
			fileUploadRef.setPreviewPhoto(`${PUBLIC_EUI_WEB}${personalWebsite.image.asset.sys.uri}`)
		} else if (!useEuiPhoto && !newUploaded) {
			fileUploadRef.setPreviewPhoto(null)
			newUploaded = false
		} else if (useEuiPhoto && !newUploaded) {
			newUploaded = true
			setEuiProfilePhoto()
		}
	})

	function setEuiProfilePhoto() {
		fileUploadRef.setPreviewPhoto(`${PUBLIC_EUI_WEB}${user.photo.asset.sys.uri}`)
	}

	async function onPhotoSelect() {
		newUploaded = true
		useEuiPhoto = false
	}

	function onPhotoDeleteClick() {
		useEuiPhoto = false
		fileUploadRef.setPreviewPhoto(null)
	}
</script>

<div>
	<PhotoUploader bind:this={fileUploadRef} crop={'500x500'} {onPhotoSelect} {onPhotoDeleteClick} />
	<CheckboxField bind:value={useEuiPhoto} class="mt-4" name="useEuiPhoto" label="Use your EUI profile photo" />

	{#if useEuiPhoto && !user.photo}
		<small>You currently have no EUI profile photo set. As a result, no photo will appear on your personal website.</small>
	{/if}
</div>
