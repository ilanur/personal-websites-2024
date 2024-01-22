<script>
	export let isLoggedIn;
</script>


<div class="bg-gray-100">
    <div class="mobile-header tray-closed">
      <div class="container mx-auto px-4 wide">
        <div class="header-tools">
          <button aria-label="Open main menu" class="mobile-menu-toggle">
            <div aria-hidden="true" class="iconFont burger"></div> <!-- Replace with Font Awesome if needed -->
          </button>
        </div>
      </div>
    </div>
    <div class="search-header">
      <div class="container mx-auto px-4 wide">
        <form class="flex items-center searchbar">
          <label for="search-field" class="sr-only">Search</label>
          <input id="search-field" placeholder="Search" class="form-input flex-1" type="search" value="">
          <button class="search-button">
            <div aria-hidden="true" class="iconFont search"></div> <!-- Replace with Font Awesome if needed -->
          </button>
        </form>
        <div class="header-tools">
          <button aria-label="View notifications" class="notifications-toggle hasUpdates">
            <div aria-hidden="true" class="iconFont notification"></div> <!-- Replace with Font Awesome if needed -->
          </button>
        </div>
      </div>
    </div>
    {#if isLoggedIn}
        <a class="btn" href="/auth/signout">Logout</a>
    {:else}
        <a class="btn" href="/auth/signin">Login</a>
    {/if}

  </div>
  