<script>
	import clsx from 'clsx'
	import AppNavLink from '$lib/components/AppNavLink.svelte'

	let { personalWebsitePages, personalWebsite, hasBlog, ...rest } = $props()
</script>

<ul class={clsx(rest.class, 'eui-gray container flex items-center gap-x-6 overflow-y-auto py-2 uppercase md:gap-x-10')}>
	{#each personalWebsitePages as page}
		<li>
			<AppNavLink class="whitespace-nowrap" href={`/${personalWebsite.websiteSlug}/${page.pageSlug}`}>
				{page.title}
			</AppNavLink>
		</li>
	{/each}
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
		@apply bg-intranet-gray-100;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		@apply bg-intranet-gray-100 cursor-pointer;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		@apply bg-intranet-gray-100;
	}
</style>
