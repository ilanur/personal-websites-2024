<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	export let data;

	/*
	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	*/
</script>

<div>
	<aside>
		<LeftSidebar />
	</aside>
	<div class="lg:pl-72">
		<header>
			<Header {data} />
		</header>	
		<main class="py-10">
			<div class="px-4 sm:px-6 lg:px-8">
				<!-- Content -->
				<slot />
			</div>
		</main>
	</div>
</div>