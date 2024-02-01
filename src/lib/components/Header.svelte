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

<header class="header bg-white shadow py-4 px-4">
	<div class="header-content flex items-center flex-row">
		<a href="/" class="w-60">
			<img src="/logo_intranet.svg" alt="EUI Intranet Logo" class="h-10" />
		</a>		
		<form action="/">
			<div class="hidden md:flex relative">
				<div
					class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
				>
					<span class="fa-solid fa-magnifying-glass"></span>
				</div>
				<input
					id="search"
					type="text"
					name="search"
					class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 border border-gray-300 w-full h-10 focus:outline-none focus:border-eui-blue"
					placeholder="Search..."
				/>
			</div>
			<div class="flex md:hidden">
				<a href="/" class="flex items-center justify-center h-10 w-10 border-transparent">
					<span class="fa-solid fa-magnifying-glass"></span>
				</a>
			</div>
		</form>
		<div class="flex ml-auto items-center">
			<div class="relative inline-block text-left">
				<div
					class="flex flex-row items-center justify-end h-8 me-7 pe-7 border-e border-gray-400 text-gray-600"
				>
					<button
						type="button"
						on:click={toggleNotificationDropdown}
						class="relative duration-300 w-8 h-8 bg-gray-100 rounded-full"
						id="notification-button"
						aria-expanded="false"
						aria-haspopup="true"
					>
						<span class="sr-only">Notifications</span>
						<span class="fa-regular fa-bell fa-lg" aria-hidden="true"></span>
						<span
							class="absolute flex items-center justify-center bg-red-600 text-red-100 h-5 min-w-5 text-xs font-bold rounded-full -top-1 -right-3"
							>99</span
						>
					</button>
				</div>
				<div
					id="notification-dropdown"
					class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none {isNotificationDropdownOpen
						? 'block'
						: 'hidden'}"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="notification-button"
					tabindex="-1"
				>
					<div class="py-1" role="none">
						<!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
						<a
							href="/"
							class="text-gray-700 block px-4 py-2"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0">Announcement #1</a
						>
						<a
							href="/"
							class="text-gray-700 block px-4 py-2"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0">Announcement #2</a
						>
						<a
							href="/"
							class="text-gray-700 block px-4 py-2"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0">Announcement #3</a
						>
					</div>
				</div>
			</div>
			<div class="flex flex-row items-center justify-end me-2">
				<img src={portrait} alt class="h-10 w-10 bg-gray-200 rounded-full" />
				<span class="flex flex-col ml-2">
					<span class="truncate w-auto max-w-48 font-bold tracking-wide leading-none"
						>{user_data.ict.Firstnames} {user_data.ict.Lastnames}</span
					>
				</span>
			</div>
			<div class="relative inline-block text-left">
				<button
					type="button"
					on:click={toggleProfileDropdown}
					class="inline-flex w-8 h-8 items-center justify-center rounded-full leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring focus:ring-eui-blue-300"
					id="profile-button"
					aria-expanded="false"
					aria-haspopup="true"
				>
					<span class="sr-only"
						>EUI profile: {user_data.ict.Firstnames} {user_data.ict.Lastnames}</span
					>
					<span
						class="fa-regular fa-angle-down {isProfileDropdownOpen ? 'fa-rotate-180' : ''}"
						aria-hidden="true"
					></span>
				</button>
				<div
					id="profile-dropdown"
					class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none {isProfileDropdownOpen
						? 'block'
						: 'hidden'}"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="profile-button"
					tabindex="-1"
				>
					<div class="py-1" role="none">
						<!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
						<a
							href={publicProfileUrl}
							class="text-gray-700 block px-4 py-2"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0">View your public profile</a
						>
					</div>
					<div class="py-1" role="none">
						<button
							on:click={() => signOut()}
							class="text-gray-700 block px-4 py-2"
							role="menuitem"
							tabindex="-1"
						>
							<span class="fa-solid fa-arrow-right-from-bracket me-2"></span>Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
