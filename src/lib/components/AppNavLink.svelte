<script>
	import { page } from '$app/stores';
	import clsx from 'clsx';

	export let href;
</script>

<a
	{href}
	class={clsx('text-lg uppercase', {
		'font-black underline': $page.url.pathname === href,
		'no-underline': $page.url.pathname !== href
	})}
>
	<slot />
</a>
