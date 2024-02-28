<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	export let data;
</script>
<header class="sticky top-0 z-40 bg-white shadow-lg">
	<Navigation {data} />
</header>
<aside>
	<LeftSidebar />
</aside>
<main class="lg:pl-72">
	<slot />
</main>