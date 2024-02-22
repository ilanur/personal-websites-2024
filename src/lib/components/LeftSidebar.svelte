<script>
	import { isSidebarOpen } from '$lib/utils/stores.js';

	$: sidebarOpen = $isSidebarOpen;

	function toggleSidebarMenu() {
		isSidebarOpen.update(value => !value);
	}
</script>

<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
<div class="relative w-72 z-30 lg:fixed lg:inset-y-0 lg:flex lg:flex-col" role="dialog" aria-modal="true">
	<!-- Off-canvas menu backdrop, show/hide based on off-canvas menu state. -->
	<div class="inset-0 bg-gray-900/90 lg:hidden transition-opacity ease-in-out duration-300 {sidebarOpen ? 'opacity-100 fixed' : 'opacity-0'}"></div>
	<div class="fixed inset-0 flex w-72 transition ease-in-out duration-300 transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
		<!-- Off-canvas menu, show/hide based on off-canvas menu state. -->
		<div class="relative flex w-full max-w-xs flex-1 pt-16 bg-white shadow-lg">
			<!-- Close button, show/hide based on off-canvas menu state. -->
			<div class="absolute left-full top-0 flex w-16 h-12 justify-center ease-in-out duration-300 {sidebarOpen ? 'block' : 'hidden'}">
				<button type="button" class="p-2.5" on:click={toggleSidebarMenu}>
					<span class="sr-only">Close sidebar</span>
					<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<!-- Sidebar component, swap this element with another sidebar if you like -->
			<div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
				<nav class="flex flex-1 flex-col">
					<ul role="list" class="flex flex-1 flex-col gap-y-7">
						<li>
							<ul role="list" class="-mx-2 space-y-1 divide-y divide-slate-100">
								<li>
									<!-- Current: " ", Default: "text-slate-800 hover:text-eui-blue hover:bg-gray-50" -->
									<a href="/" class="text-slate-800 hover:text-eui-blue hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm">
										<span class="fa-solid fa-house fa-fw"></span>
										Home
									</a>
								</li>
								<li>
									<a href="/people" class="text-slate-800 hover:text-eui-blue hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm">
										<span class="fa-solid fa-user fa-fw"></span>
										People
									</a>
								</li>
								<li>
									<a href="/announcements" class="text-slate-800 hover:text-eui-blue hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm">
										<span class="fa-solid fa-megaphone fa-fw"></span>
										Announcements
									</a>
								</li>
								<li>
									<a href="/happenings" class="text-slate-800 hover:text-eui-blue hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm">
										<span class="fa-solid fa-calendar fa-fw"></span>
										Happenings
									</a>
								</li>
								<li>
									<a href="/units" class="text-slate-800 hover:text-eui-blue hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm">
										<span class="fa-solid fa-grid-2 fa-fw"></span>
										Units
									</a>
								</li>
								<li>
									<a href="/services-procedures" class="text-slate-800 hover:text-eui-blue hover:bg-gray-50 group flex items-center gap-x-3 p-2 text-sm">
										<span class="fa-solid fa-memo-circle-info fa-fw"></span>
										Services &amp; procedures
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>