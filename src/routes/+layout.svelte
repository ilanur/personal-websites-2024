<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	export let data;

	

</script>

<header class="sticky top-0 z-40 lg:pl-72">
	<Header {data} />
</header>

<aside>
	<LeftSidebar />
</aside>

<main class="lg:pl-72">
	<slot />
</main>