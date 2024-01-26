<script>
  import { PUBLIC_EUI_WEB } from '$env/static/public';
 

 export let data;
 const user_data = data.session.algoliaUser;
 let portrait = '/default-user-dark.png';
 if(user_data.cms.photo) {
   portrait = PUBLIC_EUI_WEB + user_data.cms.photo.asset.sys.uri;
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
      <a href class="flex flex-row items-center justify-end">
      <img src="{portrait}" alt class="h-10 w-10 bg-gray-200 border rounded-full" />
      <span class="flex flex-col ml-2">
        <span class="truncate w-48 font-semibold tracking-wide leading-none">{user_data.ict.Firstnames}</span>
        <span class="truncate w-48 text-gray-500 text-xs leading-none mt-1">Web Designer</span>
      </span>
      </a>
    </div>
  </div>
</header>