<script>
	import clsx from 'clsx'
	import { page } from '$app/stores'

	let { children, ...rest } = $props()
</script>

<a
	{...rest}
	class={clsx('block py-3 text-base uppercase underline-offset-2 hover:underline lg:text-lg', {
		underline: $page.url.pathname === rest.href,
		'no-underline': $page.url.pathname !== rest.href
	})}
>
	{@render children?.()}
</a>
