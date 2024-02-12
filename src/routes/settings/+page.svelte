<script>
	export let data;
</script>

<h1 class="mb-4 font-bold leading-none tracking-tight">Settings page</h1>

{#if data.session}
	<div class="c-dashboard-layout">
		<div class="sidebar">
			<h3>Dashboard</h3>
			<p>Welcome {data.session.user.name}</p>
		</div>

		<div class="container my-12 mx-auto px-4 md:px-12">
			<div class="flex flex-wrap -mx-1 lg:-mx-4">
				Test
			</div>
		</div>

		<div>
			<slot />
		</div>
	</div>
{:else}
	<p>
		You are not allowed to see this page. Please <a href="/auth/signin">login</a>
		first
	</p>
{/if}
