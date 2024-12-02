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
					<i class="fa-brands fa-linkedin-in fa-xl"></i>
				{:else if social.type === 'ResearchGate'}
					<i class="fa-brands fa-researchgate fa-xl"></i>
				{:else if social.type === 'GoogleScholar'}
					<i class="fa-brands fa-google-scholar fa-xl"></i>
				{:else if social.type === 'Twitter'}
					<i class="fa-brands fa-x-twitter fa-xl"></i>
				{:else if social.type === 'Youtube'}
					<i class="fa-brands fa-youtube fa-xl"></i>
				{:else if social.type === 'Facebook'}
					<i class="fa-brands fa-facebook-f fa-xl"></i>
				{:else if social.type === 'Flickr'}
					<i class="fa-brands fa-flickr fa-xl"></i>
				{:else if social.type === 'Bluesky'}
					<i class="fa-brands fa-bluesky fa-xl"></i>
				{:else if social.type === 'Academia.edu'}
					<IconAcademia class="size-6" />
				{/if}
			</a>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.c-socials > a {
		@apply flex items-center justify-center no-underline;
	}

	.c-socials > a > i {
		@apply flex size-7 items-center justify-center leading-none;
	}
</style>
