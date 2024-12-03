<script>
	import { PUBLIC_EUI_WEB } from '$env/static/public'

	let { personalWebsite, people } = $props()

	const ictData = JSON.parse(people.ictPeopleApiData)
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

	{#if people.euiEmail || ictData.Phones.length}
		<div class="flex flex-col items-start pb-6 lg:pb-0">
			<p class="font-bold">Contact info</p>

			{#if people.euiEmail}
				<a class="mb-2" href={`mailto:${people.euiEmail}`}>{people.euiEmail}</a>
			{/if}

			{#if ictData?.Phones[0]}
				<a href={`tel:${ictData.Phones[0].External}`}>{ictData.Phones[0].External}</a>
			{/if}
		</div>
	{/if}

	{#if ictData?.Offices.length}
		<div class="flex flex-col pb-6 lg:pb-0">
			<p class="font-bold">Office</p>
			<p>{ictData.Offices[0].Description}</p>
		</div>
	{/if}

	{#if personalWebsite.nationality.nationality[0]}
		<div class="flex flex-col pb-6 lg:pb-0">
			<p class="font-bold">Country</p>
			<p>
				{personalWebsite.nationality.nationality[0]}
				{#if personalWebsite.city}- {personalWebsite.city}{/if}
			</p>
		</div>
	{/if}
</div>
