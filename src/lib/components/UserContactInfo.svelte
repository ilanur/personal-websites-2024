<script>
	import AppDownloadLink from './AppDownloadLink.svelte'

	let { personalWebsite } = $props()

	console.log('personalWebsite', personalWebsite)

	function downloadCV() {
		console.log('Download CV')
	}

	function downloadJobMarketPaper() {
		console.log('Download Job Marketing Paper')
	}

	function downloadResearchPaper() {
		console.log('Download Research Paper')
	}
</script>

<div class="space-y-6 lg:space-y-7 lg:border-l lg:pl-7">
	<div
		class="flex flex-col justify-between space-y-7 pb-6 md:flex-row md:space-y-0 lg:flex-col lg:space-y-7 lg:pb-0"
	>
		<AppDownloadLink onclick={downloadCV}>CURRICULUM VITAE</AppDownloadLink>
		<AppDownloadLink onclick={downloadJobMarketPaper}>Job marketing paper</AppDownloadLink>
		<AppDownloadLink onclick={downloadResearchPaper}>Research paper</AppDownloadLink>
	</div>

	<div class="flex flex-col pb-6 lg:pb-0">
		<p class="font-bold">Contact info</p>
		<a href="mailto:julia.galeraoliva@eui.eu">julia.galeraoliva@eui.eu</a>
		<a href="tel:[+39] 055 4685 231">[+39] 055 4685 231</a>
	</div>

	<div class="flex flex-col pb-6 lg:pb-0">
		<p class="font-bold">Office</p>
		<p>Villa Sanfelice, SF002</p>
		<p>Via dei Roccettini 3</p>
		<p>I-50014 San Domenico di Fiesole</p>
	</div>

	<div class="flex flex-col pb-6 lg:pb-0">
		<p class="font-bold">Office hours</p>
		<p>Mondays, 12.00-14.00</p>
	</div>

	<div class="flex flex-col pb-6 lg:pb-0">
		<p class="font-bold">Working languages</p>
		<p>English, German, Spanish</p>
	</div>
</div>
