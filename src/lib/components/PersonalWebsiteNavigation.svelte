<script>
	import clsx from 'clsx'
	import AppNavLink from '$lib/components/AppNavLink.svelte'

	let { personalWebsitePages, personalWebsite, hasBlog, ...rest } = $props()
</script>

<ul class={clsx(rest.class, 'container flex items-center gap-x-6 overflow-y-auto py-3 md:gap-x-10')}>
	{#each personalWebsitePages as page}
		<li>
			<AppNavLink class="whitespace-nowrap" href={`/${personalWebsite.websiteSlug}/${page.pageSlug}`}>
				{page.title}
			</AppNavLink>
		</li>
	{/each}
	{#if personalWebsite.enableCadmusPublications}
		<li>
			<AppNavLink class="whitespace nowrap" href={`/${personalWebsite.websiteSlug}/cadmus-publications`}>Cadmus publications</AppNavLink>
		</li>
	{/if}
	{#if hasBlog}
		<li>
			<AppNavLink class="whitespace-nowrap" href={`/${personalWebsite.websiteSlug}/blog`}>Blog</AppNavLink>
		</li>
	{/if}
</ul>

<style>
	/* width */
	::-webkit-scrollbar {
		@apply h-3.5;
	}

	/* Track */
	::-webkit-scrollbar-track {
		@apply bg-intranet-gray-200;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		@apply cursor-pointer bg-intranet-gray-100;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		@apply bg-intranet-gray-100;
	}
</style>
