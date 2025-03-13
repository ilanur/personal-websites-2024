<script>
	import AppHeader from '$lib/components/AppHeader.svelte'
	import AppFooter from '$lib/components/AppFooter.svelte'
	import '../app.css'

	let { data, children } = $props()

	// console.log(data)
</script>

<AppHeader class="sticky top-0 z-30" />

{@render children?.()}

<AppFooter />
