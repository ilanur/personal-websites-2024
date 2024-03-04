<script>
	import AppDownloadLink from './AppDownloadLink.svelte';

	function downloadCV() {
		console.log('Download CV');
	}

	function downloadJobMarketPaper() {
		console.log('Download Job Marketing Paper');
	}

	function downloadResearchPaper() {
		console.log('Download Research Paper');
	}
</script>

<div class="space-y-7 border-l pl-7">
	<div class="flex flex-col space-y-7">
		<AppDownloadLink on:click={downloadCV}>CURRICULUM VITAE</AppDownloadLink>
		<AppDownloadLink on:click={downloadJobMarketPaper}>CURRICULUM VITAE</AppDownloadLink>
		<AppDownloadLink on:click={downloadResearchPaper}>CURRICULUM VITAE</AppDownloadLink>
	</div>

	<div class="flex flex-col">
		<p class="font-bold">Contact info</p>
		<a href="mailto:julia.galeraoliva@eui.eu">julia.galeraoliva@eui.eu</a>
		<a href="tel:[+39] 055 4685 231">[+39] 055 4685 231</a>
	</div>

	<div class="flex flex-col">
		<p class="font-bold">Office</p>
		<p>Villa Sanfelice, SF002</p>
		<p>Via dei Roccettini 3</p>
		<p>I-50014 San Domenico di Fiesole</p>
	</div>

	<div class="flex flex-col">
		<p class="font-bold">Office hours</p>
		<p>Mondays, 12.00-14.00</p>
	</div>

	<div class="flex flex-col">
		<p class="font-bold">Working languages</p>
		<p>English, German, Spanish</p>
	</div>
</div>
