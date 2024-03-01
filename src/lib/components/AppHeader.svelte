<script>
	// TODO: Add mobile layout. Waiting for design.
	import clsx from 'clsx';
	import LogoEui from './icons/LogoEui.svelte';
</script>

<header class={clsx($$props.class, 'bg-white')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10" aria-label="EUI logo">
			<LogoEui />
		</a>

		<ul class="flex items-center gap-x-14 text-lg uppercase">
			<li><a href="/about">About</a></li>
			<li><a href="/research">Research</a></li>
			<li><a href="/teaching">Teaching</a></li>
			<li><a href="/publications">Publications</a></li>
			<li><a href="/contact">Contact</a></li>
		</ul>
	</nav>
</header>
