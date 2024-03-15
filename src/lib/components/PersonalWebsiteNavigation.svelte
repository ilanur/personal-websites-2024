<script>
	import clsx from 'clsx';
	import navLinks from '$lib/constants/navLinks.json';
	import AppNavLink from '$lib/components/AppNavLink.svelte';

	export let isMobile = false;
</script>

<ul
	class={clsx($$props.class, 'flex items-center gap-x-6 uppercase', {
		'lg:gap-x-14': !isMobile,
		'eui-gray container overflow-y-auto py-2 lg:gap-x-10': isMobile
	})}
>
	{#each navLinks as { href, label }}
		<li><AppNavLink {href}>{label}</AppNavLink></li>
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
