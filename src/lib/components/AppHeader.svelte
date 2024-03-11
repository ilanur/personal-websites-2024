<script>
	// TODO: Add mobile layout. Waiting for design.
	import clsx from 'clsx';
	import LogoEui from '$lib/components/icons/LogoEui.svelte';
	import AppNavLink from '$lib/components/AppNavLink.svelte';
	import AppButton from '$lib/components/AppButton.svelte';
	import navLinks from '$lib/constants/navLinks.json';

	function onLoginClick() {
		console.log('login');
	}
</script>

<header class={clsx($$props.class, 'bg-white')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10" aria-label="EUI logo">
			<LogoEui />
		</a>

		<div class="flex items-center">
			<ul class="mr-12 flex items-center gap-x-14 uppercase">
				{#each navLinks as { href, label }}
					<li><AppNavLink {href}>{label}</AppNavLink></li>
				{/each}
			</ul>

			<AppButton outlined on:click={onLoginClick}>Log in</AppButton>
		</div>
	</nav>
</header>
