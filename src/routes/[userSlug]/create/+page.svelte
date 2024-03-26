<script>
	import AppInput from '$lib/components/AppInput.svelte';
	import AppButton from '$lib/components/AppButton.svelte';
	import IconPencil from '$lib/components/icons/IconPencil.svelte';
	import { PUBLIC_EUI_WEB } from '$env/static/public';

	export let data;

	let fileInputRef;

	console.log('SESSION', data.user);

	function onChangeProfileImage() {
		console.log('Change');
		fileInputRef.click();
	}
</script>

<div class="container py-16">
	<form action="" class="space-y-5 sm:w-fit sm:min-w-80">
		<AppInput
			class="col-span-2 sm:col-span-1"
			name="title"
			label="Title of your personal website"
			value={`${data.user.ict.Firstnames} ${data.user.ict.Lastnames}`}
			disabled
		/>

		<AppInput name="email" type="email" label="E-mail" value={data.user.ict.EuiEmail} disabled />

		<div class="relative size-60 overflow-hidden rounded-md">
			<input bind:this={fileInputRef} type="file" class="hidden" accept=".jpg,.jpeg,.png,.webp" />

			<img
				src={`${PUBLIC_EUI_WEB}/${data.user.cms.photo.asset.sys.uri}`}
				class="size-full"
				alt={`${data.user.ict.Firstnames} ${data.user.ict.Lastnames}`}
			/>

			<button
				class="absolute right-2 top-2 size-10 rounded-full bg-eui-gray-90 bg-opacity-70 p-2.5 text-white duration-150 hover:p-2"
				type="button"
				on:click={onChangeProfileImage}
			>
				<IconPencil />
			</button>
		</div>

		<AppButton type="submit">Submit</AppButton>
	</form>
</div>
