<script>
	export let data;
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
          <img class="h-12 w-12 rounded-full" src="" alt="Emanuele Strano">
          <!-- User Details -->
          <div>
            <div class="text-lg font-semibold">Emanuele Strano</div>
            <a href="https://www.eui.eu/people?id=emanuele-strano" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">View your public profile</a>
          </div>
        </div>
  
        <!-- Switch User Button -->
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Switch User
        </button>
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
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
        Logout <i class="fas fa-sign-out-alt ml-2"></i>
      </button>
    </div>
  </div>
  