<script>
	import AppLink from '$lib/components/AppLink.svelte';
	import LogoEuiFull from '$lib/components/icons/LogoEuiFull.svelte';
</script>

<footer class="bg-eui-blue text-lg text-white">
	<div class="container py-10">
		<LogoEuiFull class="mb-8 h-14 w-fit [&_path]:fill-white" />

		<p class="mb-8">
			<a href="/personal-websites" class="text-eui-yellow">Personal websites</a>
			is a service provided to all academics in the European
			<br />
			University Institute by the ICT service Web unit.
		</p>

		<AppLink href="/" class="text-eui-yellow" showArrow>Browse all the EUI personal Websites</AppLink>

		<ul class="mt-12 flex flex-wrap space-x-1.5">
			<li><AppLink href="https://creativecommons.org/licenses/" target="_blank">CC BY-NC-ND</AppLink></li>
			<li>-</li>
			<li><AppLink href="https://me.eui.eu/terms-conditions-use-november-2016/" target="_blank">Terms and conditions</AppLink></li>
			<li>-</li>
			<li><AppLink href="https://www.eui.eu/About/DataProtection" target="_blank">Data Protection</AppLink></li>
			<li>-</li>
			<li><AppLink href="https://www.eui.eu/AboutTheWebsite/Accessibility" target="_blank">Accessibility</AppLink></li>
		</ul>

		<p class="mt-5">© European University Institute 2024, Badia Fiesolana - Via dei Roccettini 9, I-50014 San Domenico di Fiesole (FI) - Italy</p>
	</div>
</footer>
