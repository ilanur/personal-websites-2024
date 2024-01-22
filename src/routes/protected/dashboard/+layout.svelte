<script>
	export let data;
</script>

{#if data.session}
	<div class="c-dashboard-layout">
		<div class="sidebar">
			<h3>Dashboard</h3>
			<p>Welcome {data.session.user.name}</p>

			<ul>
				<li><a href="/protected/dashboard">PDF generate</a></li>
				<li><a href="/protected/dashboard/azure-groups">Azure groups</a></li>
			</ul>
		</div>

		<div>
			<slot />
		</div>
	</div>
{:else}
	<p>You are not allowed to see this page. Please <a href="/auth/signin">login</a> first</p>
{/if}
