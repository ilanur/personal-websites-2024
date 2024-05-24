<script>
	import clsx from 'clsx';
	import IconAcademia from './icons/IconAcademia.svelte';

	export let user;
</script>

<div data-sveltekit-preload-data="false" class={clsx('c-socials', $$props.class)}>
	{#if user.socials}
		{#if user.socials.linkedin}
			<a href={user.socials.linkedin} target="_blank" rel="noopener">
				<i class="fa-brands fa-linkedin-in fa-xl" />
			</a>
		{/if}
		{#if user.socials.research_gate}
			<a href={user.socials.research_gate} target="_blank" rel="noopener">
				<i class="fa-brands fa-researchgate fa-xl" />
			</a>
		{/if}
		{#if user.socials.google_scholar}
			<a href={user.socials.google_scholar} target="_blank" rel="noopener">
				<i class="fa-brands fa-google-scholar fa-xl" />
			</a>
		{/if}
		{#if user.socials.orcid_id}
			<a href={user.socials.orcid_id} target="_blank" rel="noopener">
				<i class="fa-brands fa-orcid fa-xl" />
			</a>
		{/if}
		{#if user.socials.twitter}
			<a href={user.socials.twitter} target="_blank" rel="noopener">
				<i class="fa-brands fa-x-twitter fa-xl" />
			</a>
		{/if}
		{#if user.socials.github}
			<a href={user.socials.github} target="_blank" rel="noopener">
				<i class="fa-brands fa-github fa-xl" />
			</a>
		{/if}
		{#if user.socials.youtube}
			<a href={user.socials.youtube} target="_blank" rel="noopener">
				<i class="fa-brands fa-youtube fa-xl" />
			</a>
		{/if}
		{#if user.socials.pinterest}
			<a href={user.socials.pinterest} target="_blank" rel="noopener">
				<i class="fa-brands fa-pinterest fa-xl" />
			</a>
		{/if}
		{#if user.socials.skype}
			<a href={user.socials.skype} target="_blank" rel="noopener">
				<i class="fa-brands fa-skype fa-xl" />
			</a>
		{/if}
		{#if user.socials.instagram}
			<a href={user.socials.instagram} target="_blank" rel="noopener">
				<i class="fa-brands fa-instagram fa-xl" />
			</a>
		{/if}
		{#if user.socials.facebook}
			<a href={user.socials.facebook} target="_blank" rel="noopener">
				<i class="fa-brands fa-facebook-f fa-xl" />
			</a>
		{/if}
		{#if user.socials.academia}
			<a href={user.socials.academia} target="_blank" rel="noopener">
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
