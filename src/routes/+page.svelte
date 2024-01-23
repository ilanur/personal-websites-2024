<script>
	export let data;
</script>

<h2>Welcome to EUI Intranet</h2>

{#if data.session}
	<div class="c-dashboard-layout">
		<div class="sidebar">
			<h3>Dashboard</h3>
			<p>Welcome {data.session.user.name}</p>

		</div>

		<div>
			<slot />
		</div>
	</div>
{:else}
	<p>You are not allowed to see this page. Please <a href="/auth/signin">login</a> first</p>
{/if}
