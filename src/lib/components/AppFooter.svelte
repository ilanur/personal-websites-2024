<script>
	import AppLink from '$lib/components/AppLink.svelte'
	import IconLogoEuiFull from '$lib/components/icons/IconLogoEuiFull.svelte'
	import quickLinks from '$lib/constants/quickLinks.json'
</script>

<footer class="bg-eui-blue text-white">
	<div class="container py-10">
		<IconLogoEuiFull class="mb-8 h-14 w-fit [&_path]:fill-white" />

		<p>
			<a href="/personal-websites" class="text-eui-yellow">Personal websites</a>
			is a service provided to all academics in the European
			<br />
			University Institute by the ICT service Web unit.
		</p>

		<AppLink href="/" target="_blank" class="my-12 text-eui-yellow" showArrow>
			Browse all the EUI personal Websites
		</AppLink>

		<ul class="flex flex-wrap space-x-1.5">
			{#each quickLinks as { href, label }, i}
				<li><AppLink {href} target="_blank">{label}</AppLink></li>
				{#if i !== quickLinks.length - 1}<li>-</li>{/if}
			{/each}
		</ul>

		<p class="mt-5">
			© European University Institute 2024, Badia Fiesolana - Via dei Roccettini 9, I-50014 San
			Domenico di Fiesole (FI) - Italy
		</p>
	</div>
</footer>
