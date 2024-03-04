<script>
	export let student;
</script>

<div class="relative py-20">
	<div class="absolute bottom-0 left-0 right-0 top-0 grid grid-cols-3">
		<div class="col-span-2 bg-eui-blue"></div>
		<div class="col-span-1 flex items-center bg-eui-gray">
			<img
				src="https://s3-alpha-sig.figma.com/img/8abf/cd3c/d7a324fe577805318386a603b20a4489?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=otFZLWglJHurbPhUZRLLiyMP5ZlMjb463Nx-b1Kuk9kHj88Y7zOaZo3L1yyFsWUHfqOA0cdCBs5Te5rQsSZBgzU2EoVphXwsGWWJ98YonLWq9xniPYo877KS5fKuGhJPXMJ3F~za5QaSJCH0JpEJmrvnA5pFZvd~97WeRPIIPc40l4lJ7UcDsO2zUDaRFwmSmTOEKHlgczXufY3EnT4Oh72JODPAz39puxFOfrFA9mN-9SZ2C7EwBIQjDMnmOC0l9PUaVwl8MVLAbGg3vXqmLpEcrvn2R5WaHCL9FU8QR2RQkbjr0ex-EUuiX-EAitr4CjsKRUnXrFMxgbrjWLUcTg__"
				alt="Student"
				class="-ml-[150px] mr-9 h-[300px] w-[300px] min-w-[300px] rounded-full border-8 border-white"
			/>

			<div
				class="flex flex-col items-center space-y-4 border-l border-eui-darker-gray pl-4 text-eui-darker-gray"
			>
				<i class="fa-brands fa-linkedin-in fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-researchgate fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-google-scholar fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-orcid fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-x-twitter fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-github fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-youtube fa-xl h-6 leading-none"></i>
				<i class="fa-brands fa-facebook-f fa-xl h-6 leading-none"></i>
			</div>
		</div>
	</div>

	<div class="container relative grid grid-cols-3 py-16">
		<div class="col-span-2 pr-[300px] text-white">
			<h1>
				{student.firstName}
				{student.lastName}
			</h1>

			<div class=" mb-7 mt-6">
				<p class="font-bold">PhD Candidate in Economics</p>
				<a href="/">European University Institute</a>
			</div>

			<p>
				I am a Postdoctoral Prize Research Fellow in Politics at Nuffield College, University of
				Oxford. I earned my PhD at the European University Institute (Florence) in July 2021. I
				study what citizens think is acceptable to do in a democracy, why that is, and how it
				changes.
			</p>
		</div>
	</div>
</div>
