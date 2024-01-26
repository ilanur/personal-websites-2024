<script>
  import { PUBLIC_EUI_WEB } from '$env/static/public';
 

 export let data;
 let isProfileDropdownOpen = false;

 const user_data = data.session.algoliaUser;
 let portrait = '/default-user-dark.png';
 if(user_data.cms.photo) {
   portrait = PUBLIC_EUI_WEB + user_data.cms.photo.asset.sys.uri;
 }

function toggleProfileDropdown() {
  isProfileDropdownOpen = !isProfileDropdownOpen;
}

</script>

<header class="header bg-white shadow py-4 px-4">
  <div class="header-content flex items-center flex-row">
    <form action="#">
      <div class="hidden md:flex relative">
        <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
          <span class="fa-solid fa-magnifying-glass"></span>
        </div>
        <input id="search" type="text" name="search" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 border border-gray-300 w-full h-10 focus:outline-none focus:border-eui-blue" placeholder="Search..." />
      </div>
      <div class="flex md:hidden">
        <a href="#" class="flex items-center justify-center h-10 w-10 border-transparent">
          <span class="fa-solid fa-magnifying-glass"></span>
        </a>
      </div>
    </form>
    <div class="flex ml-auto">
      <div href class="flex flex-row items-center justify-end">
        <img src="{portrait}" alt class="h-10 w-10 bg-gray-200 border rounded-full" />
        <span class="flex flex-col ml-2">
          <span class="truncate w-48 font-semibold tracking-wide leading-none">{user_data.ict.Firstnames} {user_data.ict.Lastnames}</span>
          {#if user_data.ict.Staff}
          <span class="truncate w-48 text-gray-500 text-xs leading-none mt-1">{user_data.ict.Staff.PostJobTitles[0].JobTitle}</span>
          {/if}
        </span>
      </div>
      <div class="relative inline-block text-left">
        <button type="button" on:click={toggleProfileDropdown} class="inline-flex w-full items-center justify-center bg-white text-sm font-semibold border hover:bg-gray-50" id="profile-button" aria-expanded="false" aria-haspopup="true">
          <span class="sr-only">Options</span>
          <span class="fa-regular fa-circle-chevron-down fa-lg" aria-hidden="true"></span>
        </button>
        <div id="profile-dropdown" class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none {isProfileDropdownOpen ? 'block' : 'hidden'}" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1" role="none">
            <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Edit</a>
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Duplicate</a>
          </div>
          <div class="py-1" role="none">
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">Archive</a>
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Move</a>
          </div>
          <div class="py-1" role="none">
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-4">Share</a>
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-5">Add to favorites</a>
          </div>
          <div class="py-1" role="none">
            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-6">Delete</a>
          </div>
        </div>
      </div>      
    </div>
  </div>
</header>