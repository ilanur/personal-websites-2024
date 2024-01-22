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
				<li><a href="/protected/dashboard/mwp">MWP Users</a></li>
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

<style scoped>
	.c-dashboard-layout {
		width: 100%;
		display: flex;
		align-items: flex-start;
		padding: 0 5rem;
	}

	.c-dashboard-layout .sidebar {
		margin-right: 3rem;
		background-color: var(--eui-light-blue);
		padding: 2rem;
		border-radius: 1rem;
		min-width: 20rem;
		position: sticky;
		top: 2rem;
	}

	.c-dashboard-layout .sidebar h3 {
		margin: 0 0 0.75rem 0;
	}

	.c-dashboard-layout .sidebar ul {
		padding-left: 0;
		list-style: none;
		margin: 1.5rem 0 0 0;
	}

	.c-dashboard-layout .sidebar ul li {
		padding: 0.35rem 0;
	}
</style>
