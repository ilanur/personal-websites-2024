<script>
	import clsx from 'clsx';
	import { page } from '$app/stores';

	export let href;
</script>

<a
	{href}
	class={clsx('text-sm uppercase md:text-lg', {
		'font-black underline': $page.url.pathname === href,
		'no-underline': $page.url.pathname !== href
	})}
>
	<slot />
</a>
