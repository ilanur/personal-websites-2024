<script>
	import clsx from 'clsx';
	import LogoEui from '$lib/components/icons/LogoEui.svelte';
	import AppButton from '$lib/components/AppButton.svelte';
	import PersonalWebsiteNavigation from '$lib/components/PersonalWebsiteNavigation.svelte';

	function onLoginClick() {
		console.log('login');
	}
</script>

<header class={clsx($$props.class, 'bg-white')}>
	<nav class="container flex justify-between py-2.5">
		<a href="/" class="h-10 min-h-10" aria-label="EUI logo">
			<LogoEui />
		</a>

		<div class="flex items-center">
			<PersonalWebsiteNavigation class="hidden md:flex" />
			<AppButton class="ml-10 whitespace-nowrap lg:ml-12" outlined on:click={onLoginClick}>
				Log in
			</AppButton>
		</div>
	</nav>
</header>
