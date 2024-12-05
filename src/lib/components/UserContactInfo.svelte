<script>
	import { PUBLIC_EUI_WEB } from '$env/static/public'

	let { personalWebsite, people } = $props()

	const ictData = JSON.parse(people.ictPeopleApiData)
</script>

<div class="space-y-4 lg:border-l lg:pl-6">
	{#if personalWebsite.cv || people.existsInICTPeopleAPI}
		<div class="flex flex-col border-b pb-4">
			<h6 class="mb-2">My links</h6>
			{#if personalWebsite.cv}
				<div class="flex items-center">
					<span class="fa-solid fa-memo-circle-info fa-sm fa-fw me-2" aria-hidden="true"></span>
					<a
						class="text-eui-light-blue-600/85 underline"
						href={`${PUBLIC_EUI_WEB}${personalWebsite.cv.sys.uri}`}
						title="View {personalWebsite.title} Curriculum vitae"
						target="_blank"
						rel="noopener"
					>
						Curriculum vitae
					</a>
				</div>
			{/if}
			{#if people.existsInICTPeopleAPI}
				<div class="mt-2 flex items-center">
					<span class="fa-solid fa-address-card fa-sm fa-fw me-2" aria-hidden="true"></span>
					<a
						class="text-eui-light-blue-600/85 underline"
						href={`${PUBLIC_EUI_WEB}/people?id=${people.sys.slug}`}
						title="View {personalWebsite.title} EUI profile"
						target="_blank"
						rel="noopener"
					>
						EUI profile
					</a>
				</div>
			{/if}
		</div>
	{/if}

	{#if people.euiEmail || ictData.Phones.length}
		<div class="flex flex-col border-b pb-4">
			<h6 class="mb-2">Contact info</h6>
			{#if people.euiEmail}
				<div class="flex items-center">
					<span class="fa-solid fa-envelope fa-sm fa-fw me-2" aria-hidden="true"></span>
					<a class="text-eui-light-blue-600/85 underline" href={`mailto:${people.euiEmail}`} title="Email {personalWebsite.title}"
						>{people.euiEmail}</a
					>
				</div>
			{/if}
			{#if ictData?.Phones[0]}
				<div class="mt-2 flex items-center">
					<span class="fa-solid fa-phone-office fa-sm fa-fw me-2" aria-hidden="true"></span>
					<a class="text-eui-light-blue-600/85 underline" href={`tel:${ictData.Phones[0].External}`} title="Call {personalWebsite.title}"
						>{ictData.Phones[0].External}</a
					>
				</div>
			{/if}
		</div>
	{/if}

	{#if ictData?.Offices.length}
		<div class="flex flex-col border-b pb-4">
			<h6 class="mb-2">Office</h6>
			<p class="flex items-center">
				<span class="fa-solid fa-location-dot fa-sm fa-fw mb-0.5 me-2" aria-hidden="true"></span>
				{ictData.Offices[0].Description}
			</p>
		</div>
	{/if}

	{#if personalWebsite.nationality.nationality[0]}
		<div class="flex flex-col">
			<h6 class="mb-2">Country</h6>
			<p class="flex items-center">
				<span class="fa-solid fa-flag fa-sm fa-fw mb-0.5 me-2" aria-hidden="true"></span>
				{personalWebsite.nationality.nationality[0]}
				{#if personalWebsite.city}- {personalWebsite.city}{/if}
			</p>
		</div>
	{/if}
</div>
