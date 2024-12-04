<script>
	import clsx from 'clsx'
	import { page } from '$app/stores'

	let { children, ...rest } = $props()
</script>

<a
	{...rest}
	class={clsx(rest.class, 'block text-base text-white underline-offset-2 hover:underline', {
		underline: $page.url.pathname === rest.href,
		'no-underline': $page.url.pathname !== rest.href
	})}
>
	{@render children?.()}
</a>
