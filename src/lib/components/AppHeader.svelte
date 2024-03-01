<script>
	// TODO: Add mobile layout. Waiting for design.
	import clsx from 'clsx';
	import LogoEui from '$lib/components/icons/LogoEui.svelte';
	import AppNavLink from '$lib/components/AppNavLink.svelte';
</script>

<header class={clsx($$props.class, 'bg-white')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10" aria-label="EUI logo">
			<LogoEui />
		</a>

		<ul class="flex items-center gap-x-14 text-lg uppercase">
			<li><AppNavLink href="/about">About</AppNavLink></li>
			<li><AppNavLink href="/research">Research</AppNavLink></li>
			<li><AppNavLink href="/teaching">Teaching</AppNavLink></li>
			<li><AppNavLink href="/publications">Publications</AppNavLink></li>
			<li><AppNavLink href="/contact">Contact</AppNavLink></li>
		</ul>
	</nav>
</header>
