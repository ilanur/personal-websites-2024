<script>
	import clsx from 'clsx'
	import IconAcademia from './icons/IconAcademia.svelte'

	let { socials = [], ...rest } = $props()
</script>

<div data-sveltekit-preload-data="false" class={clsx('c-socials', rest.class)}>
	{#each socials as social}
		{#if social.url}
			<a
				href={social.url}
				class="group text-slate-700"
				target="_blank"
				rel="noopener"
				title="Visit my {social.type} profile"
				aria-label={social.type}
			>
				{#if social.type === 'Linkedin'}
					<span class="fa-brands fa-linkedin fa-lg fa-fw"></span>
				{:else if social.type === 'ResearchGate'}
					<span class="fa-brands fa-researchgate fa-lg fa-fw"></span>
				{:else if social.type === 'GoogleScholar'}
					<span class="fa-brands fa-google-scholar fa-lg fa-fw"></span>
				{:else if social.type === 'Twitter'}
					<span class="fa-brands fa-square-x-twitter fa-lg fa-fw"></span>
				{:else if social.type === 'Youtube'}
					<span class="fa-brands fa-youtube fa-lg fa-fw"></span>
				{:else if social.type === 'Facebook'}
					<span class="fa-brands fa-facebook fa-lg fa-fw"></span>
				{:else if social.type === 'Flickr'}
					<span class="fa-brands fa-flickr fa-lg fa-fw"></span>
				{:else if social.type === 'Instagram'}
					<span class="fa-brands fa-square-instagram fa-lg fa-fw"></span>
				{:else if social.type === 'Bluesky'}
					<span class="fa-brands fa-bluesky fa-lg fa-fw"></span>
				{:else if social.type === 'Academia.edu'}
					<IconAcademia class="size-6 p-1" />
				{/if}
			</a>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.c-socials > a {
		@apply inline-flex items-center justify-center no-underline md:flex;
	}

	.c-socials > a > span {
		@apply flex size-6 items-center justify-center leading-none;
	}
</style>
