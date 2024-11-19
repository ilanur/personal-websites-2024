<script>
	import clsx from 'clsx'
	import IconAcademia from './icons/IconAcademia.svelte'

	let { socials = [], ...rest } = $props()
</script>

<div data-sveltekit-preload-data="false" class={clsx('c-socials', rest.class)}>
	{#each socials as social}
		{#if social.value}
			{#if social.type === 'linkedIn'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="LinkedIn">
					<i class="fa-brands fa-linkedin-in fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'researchGate'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="ResearchGate">
					<i class="fa-brands fa-researchgate fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'googleScholar'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Facebook">
					<i class="fa-brands fa-google-scholar fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'orcidID'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="ORCID">
					<i class="fa-brands fa-orcid fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'x'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Twitter - X">
					<i class="fa-brands fa-x-twitter fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'github'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="GitHub">
					<i class="fa-brands fa-github fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'youtube'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Youtube">
					<i class="fa-brands fa-youtube fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'pinterest'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Pinterest">
					<i class="fa-brands fa-pinterest fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'skype'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Skype">
					<i class="fa-brands fa-skype fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'instagram'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Instagram">
					<i class="fa-brands fa-instagram fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'facebook'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Facebook">
					<i class="fa-brands fa-facebook-f fa-xl"></i>
				</a>
			{/if}
			{#if social.type === 'academia'}
				<a href={social.value} target="_blank" rel="noopener" aria-label="Academia">
					<IconAcademia class="size-6" />
				</a>
			{/if}
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
