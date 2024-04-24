<script>
	import UserContactInfo from '$lib/components/UserContactInfo.svelte';

	export let data;

	const page = data.userPages.find((page) => page.title === 'About');
</script>

<div>
	<div class="container grid grid-cols-3 gap-x-16 py-12 md:py-16 xl:gap-x-36">
		<div class="col-span-3 lg:col-span-2">
			<h2 class="mb-5 font-normal">{page.title}</h2>

			{@html page.content}
		</div>

		<div
			class="col-span-3 mt-14 border-t border-eui-gray-70 pt-14 lg:col-span-1 lg:m-0 lg:border-t-0 lg:p-0"
		>
			<UserContactInfo />
		</div>
	</div>
</div>
