<script>
	import clsx from 'clsx';
	import { page } from '$app/stores';

	export let href;
</script>

<a
	{href}
	class={clsx('block py-3 text-base uppercase lg:text-lg', {
		'font-black underline': $page.url.pathname === href,
		'no-underline': $page.url.pathname !== href
	})}
>
	<slot />
</a>
