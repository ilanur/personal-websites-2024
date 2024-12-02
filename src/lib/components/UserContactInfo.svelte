<script>
	import DownloadLink from '$lib/components/DownloadLink.svelte'
	import { PUBLIC_EUI_WEB } from '$env/static/public'

	let { personalWebsite, people } = $props()
</script>

<div class="space-y-6 lg:space-y-7 lg:border-l lg:pl-7">
	{#if personalWebsite.cv || people.existsInICTPeopleAPI}
		<div class="flex flex-col gap-4 pb-6 lg:pb-0">
			{#if personalWebsite.cv}
				<div>
					<i class="fa-solid fa-arrow-up-right-from-square fa-sm mr-1"></i>
					<a href={`${PUBLIC_EUI_WEB}${personalWebsite.cv.sys.uri}`} target="_blank" rel="noopener">
						Curriculum vitae
					</a>
				</div>
			{/if}

			{#if people.existsInICTPeopleAPI}
				<div>
					<i class="fa-solid fa-arrow-up-right-from-square fa-sm mr-1"></i>
					<a href={`${PUBLIC_EUI_WEB}/people?id=${people.sys.slug}`} target="_blank" rel="noopener">
						EUI profile
					</a>
				</div>
			{/if}
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

	{#if personalWebsite.city}
		<div class="flex flex-col pb-6 lg:pb-0">
			<p class="font-bold">City</p>
			<p>{personalWebsite.city}</p>
		</div>
	{/if}

	{#if personalWebsite.nationality.nationality[0]}
		<div class="flex flex-col pb-6 lg:pb-0">
			<p class="font-bold">Country</p>
			<p>{personalWebsite.nationality.nationality[0]}</p>
		</div>
	{/if}
</div>
