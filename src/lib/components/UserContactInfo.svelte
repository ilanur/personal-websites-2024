<script>
	import DownloadLink from '$lib/components/DownloadLink.svelte'
	import { PUBLIC_EUI_WEB } from '$env/static/public'

	let { personalWebsite, people } = $props()
</script>

<div class="space-y-6 lg:space-y-7 lg:border-l lg:pl-7">
	{#if personalWebsite.cv}
		<div class="pb-6 lg:pb-0">
			<DownloadLink
				href={`${PUBLIC_EUI_WEB}${personalWebsite.cv.sys.uri}`}
				target="_blank"
				rel="noopener"
			>
				CURRICULUM VITAE
			</DownloadLink>
		</div>
	{/if}

	{#if people.euiEmail || people.mobilePhone}
		<div class="flex flex-col items-start pb-6 lg:pb-0">
			<p class="font-bold">Contact info</p>

			{#if people.euiEmail}
				<a href={`mailto:${people.euiEmail}`}>{people.euiEmail}</a>
			{/if}

			{#if people.mobilePhone}
				<a href={`tel:${people.mobilePhone}`}>{people.mobilePhone}</a>
			{/if}
		</div>
	{/if}

	<div class="flex flex-col pb-6 lg:pb-0">
		<p class="font-bold">Office</p>
		<p>{personalWebsite.city}</p>
	</div>

	<div class="flex flex-col pb-6 lg:pb-0">
		<p class="font-bold">Country</p>
		<p>{personalWebsite.nationality.nationality[0]}</p>
	</div>
</div>
