<script>
	import { enhance } from '$app/forms';
	import AppInput from '$lib/components/AppInput.svelte';
	import AppSelect from '$lib/components/AppSelect.svelte';
	import AppButton from '$lib/components/AppButton.svelte';
	import IconPencil from '$lib/components/icons/IconPencil.svelte';
	import nationalities from '$lib/constants/nationalities.json';
	import { PUBLIC_EUI_WEB } from '$env/static/public';

	export let data;

	let fileInputRef;
	let imageChanged = false;

	function onChangeProfileImageClick() {
		console.log('Change');
		fileInputRef.click();
	}

	function onImageSelected() {
		imageChanged = true;
		console.log('file selected');
	}
</script>

<div class="container py-16">
	<form
		method="POST"
		class="space-y-5 sm:w-fit sm:min-w-80"
		enctype="multipart/form-data"
		use:enhance={({ formData }) => {
			if (!imageChanged) {
				formData.delete('fileToUpload');
			}

			return async ({ update }) => await update({ reset: false });
		}}
	>
		<AppInput
			class="col-span-2 sm:col-span-1"
			name="title"
			label="Title of your personal website"
			value={`${data.user.ict.Firstnames} ${data.user.ict.Lastnames}`}
			readonly
		/>

		<AppInput
			class="col-span-2 sm:col-span-1"
			name="slug"
			label="Your personal website URL"
			value={`${PUBLIC_EUI_WEB}/${data.user.objectID}`}
			readonly
		/>

		<AppInput name="email" type="email" label="E-mail" value={data.user.ict.EuiEmail} readonly />

		<AppSelect
			name="nationality"
			options={nationalities}
			label="Nationality"
			placeholder="-- Select a value --"
		/>

		<div class="relative size-60 overflow-hidden rounded-md">
			<input
				bind:this={fileInputRef}
				id="file"
				type="file"
				name="fileToUpload"
				class="hidden"
				accept=".jpg,.jpeg,.png,.webp"
				on:change={onImageSelected}
			/>

			<img
				src={`${PUBLIC_EUI_WEB}/${data.user.cms.photo.asset.sys.uri}`}
				class="size-full"
				alt={`${data.user.ict.Firstnames} ${data.user.ict.Lastnames}`}
			/>

			<button
				class="absolute right-2 top-2 size-10 rounded-full bg-eui-gray-90 bg-opacity-70 p-2.5 text-white duration-150 hover:p-2"
				type="button"
				on:click={onChangeProfileImageClick}
			>
				<IconPencil />
			</button>
		</div>

		<AppButton type="submit">Submit</AppButton>
	</form>
</div>
