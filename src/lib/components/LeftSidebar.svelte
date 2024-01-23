<script>
  import { PUBLIC_EUI_WEB } from '$env/static/public';
  import { signOut } from "@auth/sveltekit/client"

	export let data;
  console.log(data)
  const user_data = data.session.algoliaUser;
  let portrait = '/default-user-dark.png';
  if(user_data.cms.photo) {
    portrait = PUBLIC_EUI_WEB + user_data.cms.photo.asset.sys.uri;
  }
  
</script>

<div class="bg-gray-200">
    <!-- Sticky Header -->
    <div class="sticky top-0 bg-white">
      <!-- Logo -->
      <div class="py-2 px-4">
        <a href="/" class="flex items-center">
          <img src="/logo_intranet.svg" alt="EUI Intranet Logo" class="h-10">
        </a>
      </div>
  
      <!-- User Info -->
      <div class="flex items-center justify-between p-4">
        <!-- User Image -->
        <div class="flex items-center space-x-3">
          <img class="h-12 w-12 rounded-full" src="{portrait}" alt="">
          <!-- User Details -->
          <div>
            <div class="text-lg font-semibold">{user_data.ict.Firstnames}</div>
            <a href="{PUBLIC_EUI_WEB+"/people?id="+user_data.objectID}" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">View your public profile</a>
          </div>
        </div>
        </div>
    </div>
  
    <!-- Navigation Menu -->
    <nav class="bg-gray-100 p-4">
      <ul class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <!-- Navigation Items -->
        <li class="active">
          <a href="/" class="flex items-center text-gray-700 hover:text-gray-900">
            <i class="fas fa-home"></i> Home
          </a>
        </li>
        <!-- Repeat for other items -->
      </ul>
    </nav>
  
    <!-- Logout Section -->
    <div class="p-4">
      <button on:click={() => signOut()} class="button">Logout</button>

    </div>
  </div>
  