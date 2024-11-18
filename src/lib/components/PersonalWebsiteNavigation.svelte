<script>
	import clsx from 'clsx'
	import AppNavLink from '$lib/components/AppNavLink.svelte'

	let { personalWebsite, ...rest } = $props()
</script>

<ul
	class={clsx(
		rest.class,
		'eui-gray container flex items-center gap-x-6 overflow-y-auto py-2 uppercase md:gap-x-10'
	)}
>
	{#each personalWebsite.pages as page}
		<li>
			<AppNavLink href={`/${personalWebsite.websiteSlug}/${page.pageTemplate}`}>
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
