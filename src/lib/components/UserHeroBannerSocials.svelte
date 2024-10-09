<script>
	import clsx from 'clsx'
	import IconAcademia from './icons/IconAcademia.svelte'

	export let socials = []
</script>

<div data-sveltekit-preload-data="false" class={clsx('c-socials', $$props.class)}>
	{#each socials as social}
		{#if social.type === 'linkedIn'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-linkedin-in fa-xl" />
			</a>
		{/if}
		{#if social.type === 'researchGate'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-researchgate fa-xl" />
			</a>
		{/if}
		{#if social.type === 'googleScholar'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-google-scholar fa-xl" />
			</a>
		{/if}
		{#if social.type === 'orcidID'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-orcid fa-xl" />
			</a>
		{/if}
		{#if social.type === 'x'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-x-twitter fa-xl" />
			</a>
		{/if}
		{#if social.type === 'github'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-github fa-xl" />
			</a>
		{/if}
		{#if social.type === 'youtube'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-youtube fa-xl" />
			</a>
		{/if}
		{#if social.type === 'pinterest'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-pinterest fa-xl" />
			</a>
		{/if}
		{#if social.type === 'skype'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-skype fa-xl" />
			</a>
		{/if}
		{#if social.type === 'instagram'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-instagram fa-xl" />
			</a>
		{/if}
		{#if social.type === 'facebook'}
			<a href={social.value} target="_blank" rel="noopener">
				<i class="fa-brands fa-facebook-f fa-xl" />
			</a>
		{/if}
		{#if social.type === 'academia'}
			<a href={social.value} target="_blank" rel="noopener">
				<IconAcademia class="size-6" />
			</a>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.c-socials > a {
		@apply flex justify-center no-underline;
	}

	.c-socials > a > i {
		@apply size-6 leading-none;
	}
</style>
