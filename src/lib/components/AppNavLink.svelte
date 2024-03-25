<script>
	import clsx from 'clsx';
	import { page } from '$app/stores';

	export let href;
</script>

<a
	{href}
	class={clsx('block py-3 text-base uppercase underline-offset-2 hover:underline lg:text-lg', {
		underline: $page.url.pathname === href,
		'no-underline': $page.url.pathname !== href
	})}
>
	<slot />
</a>
