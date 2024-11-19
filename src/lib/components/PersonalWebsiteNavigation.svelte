<script>
	import clsx from 'clsx'
	import AppNavLink from '$lib/components/AppNavLink.svelte'

	let { personalWebsitePages, personalWebsite, ...rest } = $props()
</script>

<ul
	class={clsx(
		rest.class,
		'eui-gray container flex items-center gap-x-6 overflow-y-auto py-2 uppercase md:gap-x-10'
	)}
>
	{#each personalWebsitePages as page}
		<li>
			<AppNavLink href={`/${personalWebsite.websiteSlug}/${page.pageSlug}`}>
				{page.title}
			</AppNavLink>
		</li>
	{/each}
</ul>

<style>
	/* width */
	::-webkit-scrollbar {
		@apply h-3.5;
	}

	/* Track */
	::-webkit-scrollbar-track {
		@apply bg-eui-gray-10;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		@apply cursor-pointer bg-eui-gray-30;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		@apply bg-eui-gray-70;
	}
</style>
