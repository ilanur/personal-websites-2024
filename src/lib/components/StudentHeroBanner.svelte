<script>
	import StudentHeroBannerSocials from '$lib/components/StudentHeroBannerSocials.svelte';

	export let student;
</script>

<div class="relative bg-eui-blue pt-0 md:bg-[transparent] md:py-20">
	<div class="bottom-0 left-0 right-0 top-0 grid grid-cols-12 md:absolute">
		<div class="col-span-12 hidden bg-eui-blue md:col-span-8 md:block" />
		<div
			class="col-span-12 flex items-center justify-center bg-eui-gray pt-12 md:col-span-4 md:justify-start md:pt-0"
		>
			<img
				src="https://s3-alpha-sig.figma.com/img/8abf/cd3c/d7a324fe577805318386a603b20a4489?Expires=1711324800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SUQFeLYw4lgIpt71cGRL~U-Gh5pHBGP6MbNh31FdA3V7EQlqW3rHJQIpHI7LJQSjBWvmLrGVBMVoIS~PTWn8M~0vsgktvxpFhOmXMv2yGLmKnux4TonTFvkCTpcBL2q--dGpjMYz2pFq8CQuTbNc6e7H0WYP6A2PxD1cmxbFlCBjvcLJwnPD2sihBQhK9-QytjOrWxDfRVigDyIQpEiafVm1-pavKj3cLoIu19LDKfOOn-JlFyS46~z8LnwprndGubAu015MG7dYFsma-sA-A9qi1DVLjAz55oyIklCKmYjEY~xAOFXTbLgKbVo8KlYHm8dBHgxgSb65T0tt5RLT1A__"
				alt="Student"
				class="-mb-[125px] size-[250px] min-w-[250px] rounded-full border-8 border-white md:-ml-[150px] md:mb-0 md:mr-9 md:size-[300px] md:min-w-[300px]"
			/>

			<StudentHeroBannerSocials
				class="z-10 hidden flex-col space-y-4 border-l border-eui-darker-gray pl-4 text-eui-darker-gray md:flex"
			/>
		</div>
	</div>

	<div class="container relative grid grid-cols-12 pb-16 pt-[calc(125px_+_2rem)] md:py-16">
		<div class="col-span-12 text-white md:col-span-8 md:pr-[200px] xl:pr-[300px]">
			<h1>
				{student.firstName}
				{student.lastName}
			</h1>

			<div class="mb-7 mt-6">
				<p class="font-bold">PhD Candidate in Economics</p>
				<a href="/">European University Institute</a>
			</div>

			<p>
				I am a Postdoctoral Prize Research Fellow in Politics at Nuffield College, University of
				Oxford. I earned my PhD at the European University Institute (Florence) in July 2021. I
				study what citizens think is acceptable to do in a democracy, why that is, and how it
				changes.
			</p>

			<StudentHeroBannerSocials
				class="mt-10 grid-cols-4 justify-between gap-12 border-t pt-10 md:hidden"
			/>
		</div>
	</div>
</div>
