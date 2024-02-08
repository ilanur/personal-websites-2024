<script>
	import { PUBLIC_EUI_WEB } from '$env/static/public';
	import { signOut } from '@auth/sveltekit/client';

	export let data;
	let isProfileDropdownOpen = false;
	let isNotificationDropdownOpen = false;
	let publicProfileUrl;

	const user_data = data.session.algoliaUser;
	let portrait = '/default-user-dark.png';

	if (user_data.cms.photo) {
		portrait = PUBLIC_EUI_WEB + user_data.cms.photo.asset.sys.uri;
	}

	if (user_data.cms.sys.slug) {
		publicProfileUrl = PUBLIC_EUI_WEB + '/people?id=' + user_data.cms.sys.slug;
	}
	
	function toggleProfileDropdown() {
		isProfileDropdownOpen = !isProfileDropdownOpen;
	}

	function toggleNotificationDropdown() {
		isNotificationDropdownOpen = !isNotificationDropdownOpen;
	}

</script>

<div class="flex h-12 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
	<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
		<span class="sr-only">Open sidebar</span>
		<span class="fa-sharp fa-solid fa-bars"></span>
	</button>
	<!-- Separator -->
	<div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"></div>
	<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
		<form class="relative flex flex-1" action="#" method="GET">
			<label for="search-field" class="sr-only">Search</label>
			<svg class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
			</svg>
			<input id="search-field" class="block h-full w-full border-0 py-0 pl-8 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." type="search" name="search">
		</form>
		<div class="flex items-center gap-x-4 lg:gap-x-6">
			<!-- Notification dropdown -->
			<div class="relative">
				<button type="button" class="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500" aria-expanded="false" aria-haspopup="true" on:click={toggleNotificationDropdown}>
					<span class="sr-only">Open notifications dropdown</span>
					<span class="fa-regular fa-bell fa-lg" aria-hidden="true"></span>
					<span class="absolute flex items-center justify-center bg-red-600 text-white min-h-5 min-w-5 text-xs font-bold rounded-full top-1 -right-2">19</span>
				</button>
				<!-- Dropdown menu, show/hide based on menu state. -->
				<div class="absolute right-0 z-10 mt-2.5 min-w-72 origin-top-right bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none {isNotificationDropdownOpen ? 'block' : 'hidden'}" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
					<ul role="list" class="divide-y divide-gray-100">
						<!-- Active: "bg-gray-50", Not Active: "" -->
						<li><a href="/" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">2024 call for applications: International Visegrad Fund Grants at the HAEU</a></li>
						<li><a href="/" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">Call for applications: the Vibeke Sørensen Grant Programme 2024</a></li>
						<li><a href="/" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">Economics Department launches 'Gender Talks at Villa La Fonte'</a></li>
						<li><a href="/" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">Law Department launches a new project on European society</a></li>
						<li><a href="/" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">EUI participates in EU Trainees Job Fair 2024</a></li>
						<li><a href="/" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">View all notifications</a></li>
					</ul>
				</div>
			</div>
			<!-- Separator -->
			<div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"></div>
			<!-- Profile dropdown -->
			<div class="relative">
				<button type="button" class="-m-1.5 flex items-center p-1.5" aria-expanded="false" aria-haspopup="true" on:click={toggleProfileDropdown}>
					<span class="sr-only">Open user profile dropdown</span>
					<img class="h-8 w-8 rounded-full bg-gray-50" src="{portrait}" alt="">
					<span class="hidden lg:flex lg:items-center">
						<span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{user_data.ict.Firstnames} {user_data.ict.Lastnames}</span>
						<svg class="ml-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
						</svg>
					</span>
				</button>
				<!-- Dropdown menu, show/hide based on menu state. -->
				<div class="absolute right-0 z-10 mt-2.5 w-48 origin-top-right bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none {isProfileDropdownOpen ? 'block' : 'hidden'}" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
					<!-- Active: "bg-gray-50", Not Active: "" -->
					<a href="{publicProfileUrl}" class="block px-3 py-1 text-sm leading-6" role="menuitem" tabindex="-1">View your public profile</a>
					<button on:click={() => signOut()} class="block px-3 py-2 text-sm block" role="menuitem" tabindex="-1">
						<span class="fa-solid fa-arrow-right-from-bracket me-2"></span>Logout
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
	




