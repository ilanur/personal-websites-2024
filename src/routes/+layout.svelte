<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	export let data;

	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<!-- Header -->
<Header {data} />
<div class="realtive h-screen md:flex bg-gray-100 w-full">
	<!-- mobile menu bar -->
	<div class="bg-gray-800 text-gray-100 flex justify-between md:hidden">
		<!-- logo -->
		<a href="/" class="block p-4 text-white font-bold">EUI Intranet</a>
		<!-- mobile menu button -->
		<button
			class="mobile-menu-button p-4 focus:outline-none focus:bg-gray-700"
			on:click={toggleMobileMenu}
		>
			<svg
				class="h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
	<!-- Left Sidebar -->
	<aside class="sidebar bg-white text-blue-100 w-64 space-y-6 absolute inset-y-0 left-0 transform {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out md:relative md:translate-x-0 z-40	">
		<LeftSidebar />
	</aside>
	<!-- Main Content Area -->
	<main class="main flex-1 overflow-y-auto">
		<div class="lg:p-12">
			<slot />
		</div>
		<!-- Footer -->
		<Footer />
	</main>
</div>
