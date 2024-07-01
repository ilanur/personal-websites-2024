<script>
	import clsx from 'clsx';
	import IconAcademia from './icons/IconAcademia.svelte';

	export let personalInformation;
</script>

<div data-sveltekit-preload-data="false" class={clsx('c-socials', $$props.class)}>
	{#if personalInformation.socials}
		{#if personalInformation.socials.linkedin}
			<a href={personalInformation.socials.linkedin} target="_blank" rel="noopener">
				<i class="fa-brands fa-linkedin-in fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.research_gate}
			<a href={personalInformation.socials.research_gate} target="_blank" rel="noopener">
				<i class="fa-brands fa-researchgate fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.google_scholar}
			<a href={personalInformation.socials.google_scholar} target="_blank" rel="noopener">
				<i class="fa-brands fa-google-scholar fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.orcid_id}
			<a href={personalInformation.socials.orcid_id} target="_blank" rel="noopener">
				<i class="fa-brands fa-orcid fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.twitter}
			<a href={personalInformation.socials.twitter} target="_blank" rel="noopener">
				<i class="fa-brands fa-x-twitter fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.github}
			<a href={personalInformation.socials.github} target="_blank" rel="noopener">
				<i class="fa-brands fa-github fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.youtube}
			<a href={personalInformation.socials.youtube} target="_blank" rel="noopener">
				<i class="fa-brands fa-youtube fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.pinterest}
			<a href={personalInformation.socials.pinterest} target="_blank" rel="noopener">
				<i class="fa-brands fa-pinterest fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.skype}
			<a href={personalInformation.socials.skype} target="_blank" rel="noopener">
				<i class="fa-brands fa-skype fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.instagram}
			<a href={personalInformation.socials.instagram} target="_blank" rel="noopener">
				<i class="fa-brands fa-instagram fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.facebook}
			<a href={personalInformation.socials.facebook} target="_blank" rel="noopener">
				<i class="fa-brands fa-facebook-f fa-xl" />
			</a>
		{/if}
		{#if personalInformation.socials.academia}
			<a href={personalInformation.socials.academia} target="_blank" rel="noopener">
				<IconAcademia class="size-6" />
			</a>
		{/if}
	{/if}
</div>

<style lang="postcss">
	.c-socials > a {
		@apply flex justify-center no-underline;
	}

	.c-socials > a > i {
		@apply size-6 leading-none;
	}
</style>
