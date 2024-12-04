<script>
	import clsx from 'clsx'
	import IconAcademia from './icons/IconAcademia.svelte'

	let { socials = [], ...rest } = $props()
</script>

<div data-sveltekit-preload-data="false" class={clsx('c-socials', rest.class)}>
	{#each socials as social}
		{#if social.url}
			<a href={social.url} target="_blank" rel="noopener" aria-label={social.type}>
				{#if social.type === 'Linkedin'}
					<span class="fa-brands fa-linkedin-in fa-xl"></span>
				{:else if social.type === 'ResearchGate'}
					<span class="fa-brands fa-researchgate fa-xl"></span>
				{:else if social.type === 'GoogleScholar'}
					<span class="fa-brands fa-google-scholar fa-xl"></span>
				{:else if social.type === 'Twitter'}
					<span class="fa-brands fa-x-twitter fa-xl"></span>
				{:else if social.type === 'Youtube'}
					<span class="fa-brands fa-youtube fa-xl"></span>
				{:else if social.type === 'Facebook'}
					<span class="fa-brands fa-facebook-f fa-xl"></span>
				{:else if social.type === 'Flickr'}
					<span class="fa-brands fa-flickr fa-xl"></span>
				{:else if social.type === 'Instagram'}
					<span class="fa-brands fa-instagram fa-xl"></span>
				{:else if social.type === 'Bluesky'}
					<span class="fa-brands fa-bluesky fa-xl"></span>
				{:else if social.type === 'Academia.edu'}
					<IconAcademia class="size-6" />
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
		@apply flex size-7 items-center justify-center leading-none;
	}
</style>
