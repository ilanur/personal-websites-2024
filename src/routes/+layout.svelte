<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data;
</script>


<div class="flex flex-col h-screen">
	<!-- Header -->
	<Header isLoggedIn={!!data.session} />
  
	<div class="flex flex-1 overflow-hidden">
	  <!-- Left Sidebar -->
	  <div class="hidden md:block">
		<LeftSidebar data={data} />
	  </div>
  
	  <!-- Main Content Area -->
	  <main class="flex-1 overflow-y-auto p-4">
		<slot />
	  </main>
	</div>
  
	<!-- Footer -->
	<Footer />
  </div>